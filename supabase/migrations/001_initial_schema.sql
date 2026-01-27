-- ============================================================================
-- RealCo Platform - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Description: Creates all essential tables for the RealCo real estate
--              investment and construction management platform
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's organization ID from JWT
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT org_id
        FROM public.profiles
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- User roles
CREATE TYPE user_role AS ENUM (
    'admin',
    'manager',
    'analyst',
    'investor',
    'provider',
    'viewer'
);

-- User tiers
CREATE TYPE user_tier AS ENUM (
    'free',
    'starter',
    'professional',
    'enterprise'
);

-- Offering/deal status
CREATE TYPE offering_status AS ENUM (
    'draft',
    'open',
    'funded',
    'closed',
    'cancelled'
);

-- Regulation modes for offerings
CREATE TYPE regulation_mode AS ENUM (
    'reg_d_506b',
    'reg_d_506c',
    'reg_a',
    'reg_cf',
    'reg_s'
);

-- Property status
CREATE TYPE property_status AS ENUM (
    'available',
    'under_contract',
    'sold',
    'off_market'
);

-- Property types
CREATE TYPE property_type AS ENUM (
    'multifamily',
    'office',
    'retail',
    'industrial',
    'mixed_use',
    'land',
    'hospitality',
    'self_storage',
    'senior_living',
    'student_housing',
    'single_family',
    'other'
);

-- Lead status
CREATE TYPE lead_status AS ENUM (
    'new',
    'contacted',
    'qualified',
    'proposal',
    'negotiation',
    'won',
    'lost'
);

-- Lead source
CREATE TYPE lead_source AS ENUM (
    'website',
    'referral',
    'broker',
    'cold_call',
    'marketing',
    'conference',
    'other'
);

-- Deal pipeline stages
CREATE TYPE deal_stage AS ENUM (
    'prospecting',
    'qualification',
    'analysis',
    'loi_submitted',
    'due_diligence',
    'under_contract',
    'closing',
    'closed_won',
    'closed_lost'
);

-- Project phases
CREATE TYPE project_phase AS ENUM (
    'planning',
    'permitting',
    'site_prep',
    'foundation',
    'framing',
    'rough_in',
    'finishing',
    'final_inspection',
    'completed',
    'on_hold'
);

-- Task status
CREATE TYPE task_status AS ENUM (
    'not_started',
    'in_progress',
    'blocked',
    'completed',
    'cancelled'
);

-- Task priority
CREATE TYPE task_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);

-- Transaction types
CREATE TYPE transaction_type AS ENUM (
    'investment',
    'distribution',
    'fee',
    'refund',
    'transfer',
    'expense',
    'income'
);

-- Transaction/distribution status
CREATE TYPE payment_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'cancelled'
);

-- Distribution types
CREATE TYPE distribution_type AS ENUM (
    'cash_flow',
    'preferred_return',
    'profit_share',
    'return_of_capital',
    'refinance',
    'sale_proceeds'
);

-- Investment status
CREATE TYPE investment_status AS ENUM (
    'pending',
    'committed',
    'funded',
    'active',
    'exited'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Organizations table (multi-tenant support)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE,
    logo_url TEXT,
    website VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User profiles (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    role user_role DEFAULT 'viewer' NOT NULL,
    name VARCHAR(255),
    company VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    tier user_tier DEFAULT 'free' NOT NULL,
    settings JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- OFFERINGS & INVESTMENTS
-- ============================================================================

-- Offerings (investment deals/syndications)
CREATE TABLE offerings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status offering_status DEFAULT 'draft' NOT NULL,
    regulation_mode regulation_mode DEFAULT 'reg_d_506b' NOT NULL,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    target_raise DECIMAL(15, 2) DEFAULT 0,
    raised_amount DECIMAL(15, 2) DEFAULT 0,
    minimum_investment DECIMAL(15, 2) DEFAULT 0,
    preferred_return DECIMAL(5, 2) DEFAULT 0,
    promoted_interest DECIMAL(5, 2) DEFAULT 0,
    close_date DATE,
    documents JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Investors (investment positions)
CREATE TABLE investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    offering_id UUID NOT NULL REFERENCES offerings(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    ownership_pct DECIMAL(8, 5) DEFAULT 0,
    status investment_status DEFAULT 'pending' NOT NULL,
    commitment_date DATE,
    funding_date DATE,
    accreditation_verified BOOLEAN DEFAULT FALSE,
    documents JSONB DEFAULT '[]',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, offering_id)
);

-- Transactions (financial movements)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offering_id UUID NOT NULL REFERENCES offerings(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status payment_status DEFAULT 'pending' NOT NULL,
    description TEXT,
    from_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    to_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reference_id VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Distributions (investor payouts)
CREATE TABLE distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offering_id UUID NOT NULL REFERENCES offerings(id) ON DELETE CASCADE,
    type distribution_type NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status payment_status DEFAULT 'pending' NOT NULL,
    distribution_date DATE NOT NULL,
    description TEXT,
    period_start DATE,
    period_end DATE,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- PROPERTY & DEAL MANAGEMENT
-- ============================================================================

-- Properties (real estate assets)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'USA',
    property_type property_type DEFAULT 'other' NOT NULL,
    asking_price DECIMAL(15, 2),
    cap_rate DECIMAL(5, 2),
    units INTEGER,
    sqft INTEGER,
    lot_size DECIMAL(10, 2),
    year_built INTEGER,
    status property_status DEFAULT 'available' NOT NULL,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    description TEXT,
    features JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    documents JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Leads (sales/acquisition leads)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_name VARCHAR(255),
    source lead_source DEFAULT 'other' NOT NULL,
    status lead_status DEFAULT 'new' NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_company VARCHAR(255),
    notes TEXT,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    last_contacted_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Deals (acquisition pipeline)
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    stage deal_stage DEFAULT 'prospecting' NOT NULL,
    probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
    value DECIMAL(15, 2) DEFAULT 0,
    offering_id UUID REFERENCES offerings(id) ON DELETE SET NULL,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    expected_close_date DATE,
    actual_close_date DATE,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- CONSTRUCTION MANAGEMENT
-- ============================================================================

-- Projects (construction projects)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    offering_id UUID REFERENCES offerings(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    phase project_phase DEFAULT 'planning' NOT NULL,
    percent_complete DECIMAL(5, 2) DEFAULT 0 CHECK (percent_complete >= 0 AND percent_complete <= 100),
    total_budget DECIMAL(15, 2) DEFAULT 0,
    spent_to_date DECIMAL(15, 2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    address VARCHAR(500),
    city VARCHAR(100),
    state VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Tasks (project tasks)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'not_started' NOT NULL,
    priority task_priority DEFAULT 'medium' NOT NULL,
    percent_complete DECIMAL(5, 2) DEFAULT 0 CHECK (percent_complete >= 0 AND percent_complete <= 100),
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    parent_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    estimated_hours DECIMAL(6, 2),
    actual_hours DECIMAL(6, 2),
    tags JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Daily Logs (construction daily reports)
CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    weather VARCHAR(100),
    temperature INTEGER,
    work_completed TEXT,
    issues TEXT,
    safety_incidents TEXT,
    visitors TEXT,
    equipment_used JSONB DEFAULT '[]',
    materials_delivered JSONB DEFAULT '[]',
    workforce_count INTEGER,
    photos JSONB DEFAULT '[]',
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(project_id, log_date, created_by)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Organizations indexes
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Profiles indexes
CREATE INDEX idx_profiles_org_id ON profiles(org_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Offerings indexes
CREATE INDEX idx_offerings_org_id ON offerings(org_id);
CREATE INDEX idx_offerings_status ON offerings(status);
CREATE INDEX idx_offerings_regulation_mode ON offerings(regulation_mode);
CREATE INDEX idx_offerings_created_at ON offerings(created_at DESC);

-- Investors indexes
CREATE INDEX idx_investors_user_id ON investors(user_id);
CREATE INDEX idx_investors_offering_id ON investors(offering_id);
CREATE INDEX idx_investors_status ON investors(status);

-- Transactions indexes
CREATE INDEX idx_transactions_offering_id ON transactions(offering_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_from_user_id ON transactions(from_user_id);
CREATE INDEX idx_transactions_to_user_id ON transactions(to_user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- Distributions indexes
CREATE INDEX idx_distributions_offering_id ON distributions(offering_id);
CREATE INDEX idx_distributions_status ON distributions(status);
CREATE INDEX idx_distributions_distribution_date ON distributions(distribution_date);

-- Properties indexes
CREATE INDEX idx_properties_org_id ON properties(org_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_city_state ON properties(city, state);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

-- Leads indexes
CREATE INDEX idx_leads_org_id ON leads(org_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Deals indexes
CREATE INDEX idx_deals_org_id ON deals(org_id);
CREATE INDEX idx_deals_property_id ON deals(property_id);
CREATE INDEX idx_deals_offering_id ON deals(offering_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_assigned_to ON deals(assigned_to);
CREATE INDEX idx_deals_created_at ON deals(created_at DESC);

-- Projects indexes
CREATE INDEX idx_projects_org_id ON projects(org_id);
CREATE INDEX idx_projects_offering_id ON projects(offering_id);
CREATE INDEX idx_projects_property_id ON projects(property_id);
CREATE INDEX idx_projects_phase ON projects(phase);
CREATE INDEX idx_projects_project_manager_id ON projects(project_manager_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Tasks indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);

-- Daily Logs indexes
CREATE INDEX idx_daily_logs_project_id ON daily_logs(project_id);
CREATE INDEX idx_daily_logs_log_date ON daily_logs(log_date DESC);
CREATE INDEX idx_daily_logs_created_by ON daily_logs(created_by);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offerings_updated_at
    BEFORE UPDATE ON offerings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investors_updated_at
    BEFORE UPDATE ON investors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_distributions_updated_at
    BEFORE UPDATE ON distributions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
    BEFORE UPDATE ON properties
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
    BEFORE UPDATE ON deals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at
    BEFORE UPDATE ON daily_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE offerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES: Organizations
-- ============================================================================

-- Users can view their own organization
CREATE POLICY "Users can view own organization"
    ON organizations FOR SELECT
    USING (id = get_user_org_id());

-- Admins can update their organization
CREATE POLICY "Admins can update own organization"
    ON organizations FOR UPDATE
    USING (id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- ============================================================================
-- RLS POLICIES: Profiles
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

-- Users can view profiles in their organization
CREATE POLICY "Users can view org profiles"
    ON profiles FOR SELECT
    USING (org_id = get_user_org_id());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

-- Allow insert during signup (service role handles this typically)
CREATE POLICY "Enable insert for authenticated users only"
    ON profiles FOR INSERT
    WITH CHECK (id = auth.uid());

-- ============================================================================
-- RLS POLICIES: Offerings
-- ============================================================================

-- Users can view offerings in their organization
CREATE POLICY "Users can view org offerings"
    ON offerings FOR SELECT
    USING (org_id = get_user_org_id());

-- Investors can view offerings they've invested in
CREATE POLICY "Investors can view their offerings"
    ON offerings FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM investors WHERE offering_id = offerings.id AND user_id = auth.uid()
    ));

-- Admins and managers can insert offerings
CREATE POLICY "Admins and managers can create offerings"
    ON offerings FOR INSERT
    WITH CHECK (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ));

-- Admins and managers can update offerings
CREATE POLICY "Admins and managers can update offerings"
    ON offerings FOR UPDATE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ));

-- Admins can delete offerings
CREATE POLICY "Admins can delete offerings"
    ON offerings FOR DELETE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- ============================================================================
-- RLS POLICIES: Investors
-- ============================================================================

-- Users can view their own investments
CREATE POLICY "Users can view own investments"
    ON investors FOR SELECT
    USING (user_id = auth.uid());

-- Admins and managers can view all investments in their org offerings
CREATE POLICY "Admins can view org investments"
    ON investors FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM offerings o
        WHERE o.id = investors.offering_id AND o.org_id = get_user_org_id()
    ) AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ));

-- Admins and managers can manage investments
CREATE POLICY "Admins can manage investments"
    ON investors FOR ALL
    USING (EXISTS (
        SELECT 1 FROM offerings o
        WHERE o.id = investors.offering_id AND o.org_id = get_user_org_id()
    ) AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ));

-- ============================================================================
-- RLS POLICIES: Transactions
-- ============================================================================

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
    ON transactions FOR SELECT
    USING (from_user_id = auth.uid() OR to_user_id = auth.uid());

-- Admins can view all org transactions
CREATE POLICY "Admins can view org transactions"
    ON transactions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM offerings o
        WHERE o.id = transactions.offering_id AND o.org_id = get_user_org_id()
    ) AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ));

-- Admins can create transactions
CREATE POLICY "Admins can create transactions"
    ON transactions FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM offerings o
        WHERE o.id = transactions.offering_id AND o.org_id = get_user_org_id()
    ) AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ));

-- Admins can update transactions
CREATE POLICY "Admins can update transactions"
    ON transactions FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM offerings o
        WHERE o.id = transactions.offering_id AND o.org_id = get_user_org_id()
    ) AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- ============================================================================
-- RLS POLICIES: Distributions
-- ============================================================================

-- Investors can view distributions for their offerings
CREATE POLICY "Investors can view distributions"
    ON distributions FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM investors i
        WHERE i.offering_id = distributions.offering_id AND i.user_id = auth.uid()
    ));

-- Admins can manage distributions
CREATE POLICY "Admins can manage distributions"
    ON distributions FOR ALL
    USING (EXISTS (
        SELECT 1 FROM offerings o
        WHERE o.id = distributions.offering_id AND o.org_id = get_user_org_id()
    ) AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ));

-- ============================================================================
-- RLS POLICIES: Properties
-- ============================================================================

-- Users can view properties in their organization
CREATE POLICY "Users can view org properties"
    ON properties FOR SELECT
    USING (org_id = get_user_org_id());

-- Admins and managers can create properties
CREATE POLICY "Admins can create properties"
    ON properties FOR INSERT
    WITH CHECK (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'analyst')
    ));

-- Admins and managers can update properties
CREATE POLICY "Admins can update properties"
    ON properties FOR UPDATE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'analyst')
    ));

-- Admins can delete properties
CREATE POLICY "Admins can delete properties"
    ON properties FOR DELETE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- ============================================================================
-- RLS POLICIES: Leads
-- ============================================================================

-- Users can view leads in their organization
CREATE POLICY "Users can view org leads"
    ON leads FOR SELECT
    USING (org_id = get_user_org_id());

-- Team members can create leads
CREATE POLICY "Team can create leads"
    ON leads FOR INSERT
    WITH CHECK (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'analyst')
    ));

-- Team members can update leads
CREATE POLICY "Team can update leads"
    ON leads FOR UPDATE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'analyst')
    ));

-- Admins can delete leads
CREATE POLICY "Admins can delete leads"
    ON leads FOR DELETE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- ============================================================================
-- RLS POLICIES: Deals
-- ============================================================================

-- Users can view deals in their organization
CREATE POLICY "Users can view org deals"
    ON deals FOR SELECT
    USING (org_id = get_user_org_id());

-- Team members can create deals
CREATE POLICY "Team can create deals"
    ON deals FOR INSERT
    WITH CHECK (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'analyst')
    ));

-- Team members can update deals
CREATE POLICY "Team can update deals"
    ON deals FOR UPDATE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'analyst')
    ));

-- Admins can delete deals
CREATE POLICY "Admins can delete deals"
    ON deals FOR DELETE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- ============================================================================
-- RLS POLICIES: Projects
-- ============================================================================

-- Users can view projects in their organization
CREATE POLICY "Users can view org projects"
    ON projects FOR SELECT
    USING (org_id = get_user_org_id());

-- Providers can view projects they're assigned to
CREATE POLICY "Providers can view assigned projects"
    ON projects FOR SELECT
    USING (project_manager_id = auth.uid());

-- Team members can create projects
CREATE POLICY "Team can create projects"
    ON projects FOR INSERT
    WITH CHECK (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ));

-- Team members can update projects
CREATE POLICY "Team can update projects"
    ON projects FOR UPDATE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ) OR project_manager_id = auth.uid());

-- Admins can delete projects
CREATE POLICY "Admins can delete projects"
    ON projects FOR DELETE
    USING (org_id = get_user_org_id() AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- ============================================================================
-- RLS POLICIES: Tasks
-- ============================================================================

-- Users can view tasks for projects they have access to
CREATE POLICY "Users can view project tasks"
    ON tasks FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = tasks.project_id AND (
            p.org_id = get_user_org_id() OR p.project_manager_id = auth.uid()
        )
    ));

-- Users can view tasks assigned to them
CREATE POLICY "Users can view assigned tasks"
    ON tasks FOR SELECT
    USING (assigned_to = auth.uid());

-- Team members can create tasks
CREATE POLICY "Team can create tasks"
    ON tasks FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = tasks.project_id AND (
            p.org_id = get_user_org_id() OR p.project_manager_id = auth.uid()
        )
    ));

-- Team members can update tasks (including assignees updating their tasks)
CREATE POLICY "Team can update tasks"
    ON tasks FOR UPDATE
    USING (
        assigned_to = auth.uid() OR
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = tasks.project_id AND (
                p.org_id = get_user_org_id() OR p.project_manager_id = auth.uid()
            )
        )
    );

-- Admins and project managers can delete tasks
CREATE POLICY "Managers can delete tasks"
    ON tasks FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = tasks.project_id AND (
            (p.org_id = get_user_org_id() AND EXISTS (
                SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
            )) OR p.project_manager_id = auth.uid()
        )
    ));

-- ============================================================================
-- RLS POLICIES: Daily Logs
-- ============================================================================

-- Users can view daily logs for projects they have access to
CREATE POLICY "Users can view project daily logs"
    ON daily_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = daily_logs.project_id AND (
            p.org_id = get_user_org_id() OR p.project_manager_id = auth.uid()
        )
    ));

-- Users can create daily logs for projects they have access to
CREATE POLICY "Team can create daily logs"
    ON daily_logs FOR INSERT
    WITH CHECK (
        created_by = auth.uid() AND
        EXISTS (
            SELECT 1 FROM projects p
            WHERE p.id = daily_logs.project_id AND (
                p.org_id = get_user_org_id() OR p.project_manager_id = auth.uid()
            )
        )
    );

-- Users can update their own daily logs
CREATE POLICY "Users can update own daily logs"
    ON daily_logs FOR UPDATE
    USING (created_by = auth.uid());

-- Managers can update any daily log in their projects
CREATE POLICY "Managers can update daily logs"
    ON daily_logs FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = daily_logs.project_id AND p.org_id = get_user_org_id()
    ) AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager')
    ));

-- Admins can delete daily logs
CREATE POLICY "Admins can delete daily logs"
    ON daily_logs FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM projects p
        WHERE p.id = daily_logs.project_id AND p.org_id = get_user_org_id()
    ) AND EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    ));

-- ============================================================================
-- HELPER FUNCTIONS FOR PROFILE CREATION
-- ============================================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, tier)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'viewer'),
        'free'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- GRANTS (for service role access)
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant access to sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ============================================================================
-- COMMENTS (documentation)
-- ============================================================================

COMMENT ON TABLE organizations IS 'Multi-tenant organization support for the RealCo platform';
COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE offerings IS 'Investment offerings/syndication deals';
COMMENT ON TABLE investors IS 'Investor positions in offerings';
COMMENT ON TABLE transactions IS 'Financial transactions for offerings';
COMMENT ON TABLE distributions IS 'Investor distributions and payouts';
COMMENT ON TABLE properties IS 'Real estate property listings and assets';
COMMENT ON TABLE leads IS 'Sales and acquisition leads';
COMMENT ON TABLE deals IS 'Deal pipeline for property acquisitions';
COMMENT ON TABLE projects IS 'Construction and renovation projects';
COMMENT ON TABLE tasks IS 'Project tasks and work items';
COMMENT ON TABLE daily_logs IS 'Construction daily progress reports';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
