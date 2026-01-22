/**
 * Project Initialization Service
 * Automatically creates construction projects when offerings are funded
 */

import { PrismaClient } from '@prisma/client';
import type { ProjectType, ProjectPhase } from '@prisma/client';
import { ProjectService } from './project.service.js';
import { TaskService } from './task.service.js';
import { EscrowAccountService } from './escrow.service.js';
import { emit, on } from './events.js';
import { ValidationError } from './errors.js';

interface TaskTemplate {
  name: string;
  description: string;
  phase: ProjectPhase;
  durationDays: number;
  dependencies: string[]; // Task names
  budgetPercentage: number; // % of total budget
  assigneeRole?: string;
}

// Task templates by project type
const TASK_TEMPLATES: Record<ProjectType, TaskTemplate[]> = {
  NEW_CONSTRUCTION: [
    // Pre-Construction
    { name: 'Site Survey', description: 'Complete site survey and boundary verification', phase: 'PRE_CONSTRUCTION', durationDays: 5, dependencies: [], budgetPercentage: 0.5, assigneeRole: 'SURVEYOR' },
    { name: 'Soil Testing', description: 'Conduct geotechnical testing', phase: 'PRE_CONSTRUCTION', durationDays: 7, dependencies: ['Site Survey'], budgetPercentage: 0.8, assigneeRole: 'ENGINEER' },
    { name: 'Building Permit Application', description: 'Submit plans to building department', phase: 'PRE_CONSTRUCTION', durationDays: 30, dependencies: ['Soil Testing'], budgetPercentage: 1.0, assigneeRole: 'ARCHITECT' },
    
    // Foundation
    { name: 'Site Clearing', description: 'Clear and grade site', phase: 'FOUNDATION', durationDays: 5, dependencies: ['Building Permit Application'], budgetPercentage: 2.5 },
    { name: 'Foundation Excavation', description: 'Excavate for foundation', phase: 'FOUNDATION', durationDays: 3, dependencies: ['Site Clearing'], budgetPercentage: 3.0 },
    { name: 'Foundation Forms', description: 'Install foundation forms and rebar', phase: 'FOUNDATION', durationDays: 5, dependencies: ['Foundation Excavation'], budgetPercentage: 4.5 },
    { name: 'Foundation Pour', description: 'Pour concrete foundation', phase: 'FOUNDATION', durationDays: 2, dependencies: ['Foundation Forms'], budgetPercentage: 6.0 },
    { name: 'Foundation Cure', description: 'Allow foundation to cure', phase: 'FOUNDATION', durationDays: 7, dependencies: ['Foundation Pour'], budgetPercentage: 0 },
    
    // Framing
    { name: 'Floor Framing', description: 'Frame first floor system', phase: 'FRAMING', durationDays: 10, dependencies: ['Foundation Cure'], budgetPercentage: 8.0 },
    { name: 'Wall Framing', description: 'Frame exterior and interior walls', phase: 'FRAMING', durationDays: 15, dependencies: ['Floor Framing'], budgetPercentage: 12.0 },
    { name: 'Roof Framing', description: 'Frame roof structure', phase: 'FRAMING', durationDays: 10, dependencies: ['Wall Framing'], budgetPercentage: 10.0 },
    { name: 'Framing Inspection', description: 'Municipal framing inspection', phase: 'FRAMING', durationDays: 1, dependencies: ['Roof Framing'], budgetPercentage: 0 },
    
    // MEP Rough-in
    { name: 'Electrical Rough-in', description: 'Install electrical wiring', phase: 'MEP_ROUGH_IN', durationDays: 10, dependencies: ['Framing Inspection'], budgetPercentage: 7.0 },
    { name: 'Plumbing Rough-in', description: 'Install plumbing systems', phase: 'MEP_ROUGH_IN', durationDays: 10, dependencies: ['Framing Inspection'], budgetPercentage: 8.0 },
    { name: 'HVAC Rough-in', description: 'Install HVAC ductwork', phase: 'MEP_ROUGH_IN', durationDays: 10, dependencies: ['Framing Inspection'], budgetPercentage: 9.0 },
    { name: 'MEP Inspection', description: 'Municipal MEP rough-in inspection', phase: 'MEP_ROUGH_IN', durationDays: 1, dependencies: ['Electrical Rough-in', 'Plumbing Rough-in', 'HVAC Rough-in'], budgetPercentage: 0 },
    
    // Exterior
    { name: 'Roofing', description: 'Install roofing system', phase: 'EXTERIOR', durationDays: 7, dependencies: ['MEP Inspection'], budgetPercentage: 6.0 },
    { name: 'Windows & Doors', description: 'Install windows and exterior doors', phase: 'EXTERIOR', durationDays: 5, dependencies: ['Roofing'], budgetPercentage: 5.0 },
    { name: 'Siding', description: 'Install exterior siding', phase: 'EXTERIOR', durationDays: 10, dependencies: ['Windows & Doors'], budgetPercentage: 7.0 },
    
    // Interior Finishes
    { name: 'Insulation', description: 'Install insulation', phase: 'INTERIOR_FINISHES', durationDays: 5, dependencies: ['Siding'], budgetPercentage: 3.0 },
    { name: 'Drywall', description: 'Hang and finish drywall', phase: 'INTERIOR_FINISHES', durationDays: 15, dependencies: ['Insulation'], budgetPercentage: 8.0 },
    { name: 'Interior Paint', description: 'Paint interior surfaces', phase: 'INTERIOR_FINISHES', durationDays: 10, dependencies: ['Drywall'], budgetPercentage: 4.0 },
    { name: 'Flooring', description: 'Install flooring', phase: 'INTERIOR_FINISHES', durationDays: 10, dependencies: ['Interior Paint'], budgetPercentage: 6.0 },
    { name: 'Trim & Cabinets', description: 'Install trim work and cabinets', phase: 'INTERIOR_FINISHES', durationDays: 10, dependencies: ['Flooring'], budgetPercentage: 7.0 },
    
    // Final
    { name: 'Final Electrical', description: 'Install fixtures and devices', phase: 'FINAL', durationDays: 5, dependencies: ['Trim & Cabinets'], budgetPercentage: 3.0 },
    { name: 'Final Plumbing', description: 'Install fixtures', phase: 'FINAL', durationDays: 5, dependencies: ['Trim & Cabinets'], budgetPercentage: 3.0 },
    { name: 'Final HVAC', description: 'Install HVAC units and registers', phase: 'FINAL', durationDays: 5, dependencies: ['Trim & Cabinets'], budgetPercentage: 3.0 },
    { name: 'Appliances', description: 'Install appliances', phase: 'FINAL', durationDays: 2, dependencies: ['Final Electrical', 'Final Plumbing'], budgetPercentage: 0 },
    { name: 'Landscaping', description: 'Complete landscaping', phase: 'FINAL', durationDays: 7, dependencies: ['Appliances'], budgetPercentage: 4.0 },
    { name: 'Final Inspection', description: 'Municipal final inspection', phase: 'FINAL', durationDays: 1, dependencies: ['Landscaping'], budgetPercentage: 0 },
    { name: 'Certificate of Occupancy', description: 'Obtain CO', phase: 'CLOSEOUT', durationDays: 3, dependencies: ['Final Inspection'], budgetPercentage: 0.2 }
  ],
  
  RENOVATION: [
    { name: 'Demolition', description: 'Selective demolition', phase: 'PRE_CONSTRUCTION', durationDays: 5, dependencies: [], budgetPercentage: 8.0 },
    { name: 'Structural Repairs', description: 'Repair structure as needed', phase: 'FOUNDATION', durationDays: 10, dependencies: ['Demolition'], budgetPercentage: 15.0 },
    { name: 'Electrical Upgrade', description: 'Upgrade electrical system', phase: 'MEP_ROUGH_IN', durationDays: 10, dependencies: ['Structural Repairs'], budgetPercentage: 12.0 },
    { name: 'Plumbing Upgrade', description: 'Upgrade plumbing', phase: 'MEP_ROUGH_IN', durationDays: 10, dependencies: ['Structural Repairs'], budgetPercentage: 12.0 },
    { name: 'HVAC Upgrade', description: 'Upgrade HVAC', phase: 'MEP_ROUGH_IN', durationDays: 7, dependencies: ['Structural Repairs'], budgetPercentage: 10.0 },
    { name: 'Drywall & Paint', description: 'New drywall and paint', phase: 'INTERIOR_FINISHES', durationDays: 15, dependencies: ['Electrical Upgrade', 'Plumbing Upgrade', 'HVAC Upgrade'], budgetPercentage: 15.0 },
    { name: 'New Flooring', description: 'Install new flooring', phase: 'INTERIOR_FINISHES', durationDays: 7, dependencies: ['Drywall & Paint'], budgetPercentage: 12.0 },
    { name: 'Kitchen & Bath', description: 'Kitchen and bathroom renovation', phase: 'INTERIOR_FINISHES', durationDays: 15, dependencies: ['New Flooring'], budgetPercentage: 20.0 },
    { name: 'Final Cleanup', description: 'Final cleaning and touch-up', phase: 'FINAL', durationDays: 3, dependencies: ['Kitchen & Bath'], budgetPercentage: 2.0 },
    { name: 'Final Inspection', description: 'Final inspection and CO', phase: 'CLOSEOUT', durationDays: 3, dependencies: ['Final Cleanup'], budgetPercentage: 1.0 }
  ],
  
  MULTI_FAMILY: [
    // Similar to NEW_CONSTRUCTION but with multi-unit considerations
    { name: 'Site Prep', description: 'Site preparation', phase: 'PRE_CONSTRUCTION', durationDays: 10, dependencies: [], budgetPercentage: 3.0 },
    { name: 'Foundation', description: 'Foundation work', phase: 'FOUNDATION', durationDays: 20, dependencies: ['Site Prep'], budgetPercentage: 12.0 },
    { name: 'Framing', description: 'Structural framing', phase: 'FRAMING', durationDays: 45, dependencies: ['Foundation'], budgetPercentage: 18.0 },
    { name: 'MEP Systems', description: 'MEP installation', phase: 'MEP_ROUGH_IN', durationDays: 30, dependencies: ['Framing'], budgetPercentage: 22.0 },
    { name: 'Exterior Completion', description: 'Exterior work', phase: 'EXTERIOR', durationDays: 25, dependencies: ['MEP Systems'], budgetPercentage: 15.0 },
    { name: 'Unit Finishes', description: 'Interior unit finishes', phase: 'INTERIOR_FINISHES', durationDays: 45, dependencies: ['Exterior Completion'], budgetPercentage: 25.0 },
    { name: 'Common Areas', description: 'Complete common areas', phase: 'INTERIOR_FINISHES', durationDays: 15, dependencies: ['Unit Finishes'], budgetPercentage: 8.0 },
    { name: 'Final Inspection', description: 'Final inspections', phase: 'CLOSEOUT', durationDays: 5, dependencies: ['Common Areas'], budgetPercentage: 1.0 }
  ],
  
  COMMERCIAL: [
    { name: 'Tenant Improvements', description: 'TI work', phase: 'PRE_CONSTRUCTION', durationDays: 5, dependencies: [], budgetPercentage: 5.0 },
    { name: 'Demolition', description: 'Demo existing', phase: 'FOUNDATION', durationDays: 7, dependencies: ['Tenant Improvements'], budgetPercentage: 8.0 },
    { name: 'New Framing', description: 'New walls and structure', phase: 'FRAMING', durationDays: 15, dependencies: ['Demolition'], budgetPercentage: 18.0 },
    { name: 'MEP Installation', description: 'Commercial MEP', phase: 'MEP_ROUGH_IN', durationDays: 20, dependencies: ['New Framing'], budgetPercentage: 25.0 },
    { name: 'Fire Protection', description: 'Sprinkler system', phase: 'MEP_ROUGH_IN', durationDays: 10, dependencies: ['MEP Installation'], budgetPercentage: 8.0 },
    { name: 'Finishes', description: 'Commercial finishes', phase: 'INTERIOR_FINISHES', durationDays: 20, dependencies: ['Fire Protection'], budgetPercentage: 20.0 },
    { name: 'ADA Compliance', description: 'ADA requirements', phase: 'FINAL', durationDays: 5, dependencies: ['Finishes'], budgetPercentage: 5.0 },
    { name: 'Final Inspection', description: 'Commercial CO', phase: 'CLOSEOUT', durationDays: 5, dependencies: ['ADA Compliance'], budgetPercentage: 1.0 }
  ]
};

export class ProjectInitializationService {
  private projectService: ProjectService;
  private taskService: TaskService;
  private escrowService: EscrowAccountService;

  constructor(private prisma: PrismaClient) {
    this.projectService = new ProjectService(prisma);
    this.taskService = new TaskService(prisma);
    this.escrowService = new EscrowAccountService(prisma);
    
    // Register event listener
    this.registerEventListeners();
  }

  /**
   * Register event listeners for automatic project initialization
   */
  private registerEventListeners(): void {
    on('offering.funded', async (data: any) => {
      try {
        await this.initiateConstructionProject(data.offeringId);
      } catch (error) {
        console.error('Failed to initiate construction project', {
          offeringId: data.offeringId,
          error
        });
      }
    });
  }

  /**
   * Main entry point: Initialize construction project from funded offering
   */
  async initiateConstructionProject(offeringId: string): Promise<any> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Get offering data
      const offering = await tx.offering.findUnique({
        where: { id: offeringId },
        include: {
          developmentProject: true,
          organization: true,
          investments: {
            where: { status: 'CONFIRMED' }
          }
        }
      });

      if (!offering) {
        throw new ValidationError('Offering not found');
      }

      if (offering.status !== 'FUNDED') {
        throw new ValidationError('Offering must be fully funded');
      }

      // Check if project already exists
      const existingProject = await tx.project.findFirst({
        where: { developmentProjectId: offering.developmentProjectId }
      });

      if (existingProject) {
        console.log('Project already exists for this development project');
        return existingProject;
      }

      // 2. Create construction project
      const project = await this.projectService.createProject(
        offering.developmentProjectId,
        {
          plannedStartDate: offering.developmentProject.constructionStartDate || new Date(),
          plannedEndDate: offering.developmentProject.constructionEndDate || 
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
          totalBudget: offering.targetAmount, // Use offering target as budget
          description: `Construction project for ${offering.name}`
        }
      );

      // 3. Apply task template based on project type
      const tasks = await this.applyTaskTemplate(
        tx,
        project.id,
        offering.developmentProject.projectType as ProjectType,
        offering.targetAmount
      );

      // 4. Create standard milestones
      await this.createStandardMilestones(tx, project.id, tasks);

      // 5. Create or link escrow account (should already exist from investments)
      let escrowAccount = await tx.escrowAccount.findUnique({
        where: { offeringId }
      });

      if (!escrowAccount) {
        escrowAccount = await this.escrowService.createEscrowAccount(offeringId);
      }

      // 6. Assign project team
      await this.assignProjectTeam(tx, project.id, offering);

      // 7. Create audit log
      await tx.auditEvent.create({
        data: {
          action: 'project.initialized',
          entityType: 'Project',
          entityId: project.id,
          metadata: {
            offeringId,
            developmentProjectId: offering.developmentProjectId,
            fundingAmount: offering.totalRaised,
            taskCount: tasks.length
          }
        }
      });

      // 8. Emit event for notifications
      emit('project.initialized', {
        projectId: project.id,
        offeringId,
        organizationId: offering.organizationId
      });

      return project;
    });
  }

  /**
   * Apply task template based on project type
   */
  private async applyTaskTemplate(
    tx: any,
    projectId: string,
    projectType: ProjectType,
    totalBudget: number
  ): Promise<any[]> {
    const templates = TASK_TEMPLATES[projectType] || TASK_TEMPLATES.NEW_CONSTRUCTION;
    const createdTasks: any[] = [];
    const taskMap = new Map<string, any>();

    // First pass: Create all tasks
    for (const template of templates) {
      const budgetAmount = Math.floor(totalBudget * (template.budgetPercentage / 100));
      
      const task = await tx.task.create({
        data: {
          projectId,
          name: template.name,
          description: template.description,
          status: 'NOT_STARTED',
          priority: 'MEDIUM',
          durationDays: template.durationDays,
          budgetAmount,
          percentComplete: 0,
          predecessorTaskIds: [] // Will be updated in second pass
        }
      });

      createdTasks.push(task);
      taskMap.set(template.name, task);
    }

    // Second pass: Update dependencies
    for (let i = 0; i < templates.length; i++) {
      const template = templates[i];
      const task = createdTasks[i];

      if (template.dependencies.length > 0) {
        const predecessorIds = template.dependencies
          .map(depName => taskMap.get(depName)?.id)
          .filter(id => id !== undefined);

        await tx.task.update({
          where: { id: task.id },
          data: {
            predecessorTaskIds: predecessorIds
          }
        });
      }
    }

    // Calculate critical path
    await this.taskService.calculateCriticalPath(projectId);

    return createdTasks;
  }

  /**
   * Create standard milestones for project
   */
  private async createStandardMilestones(
    tx: any,
    projectId: string,
    tasks: any[]
  ): Promise<void> {
    const milestones = [
      { name: 'Building Permit Approved', relatedTaskNames: ['Building Permit Application'] },
      { name: 'Foundation Complete', relatedTaskNames: ['Foundation Pour', 'Foundation Cure'] },
      { name: 'Framing Complete', relatedTaskNames: ['Framing Inspection'] },
      { name: 'MEP Rough-in Complete', relatedTaskNames: ['MEP Inspection'] },
      { name: 'Exterior Complete', relatedTaskNames: ['Siding', 'Roofing'] },
      { name: 'Interior Finishes Complete', relatedTaskNames: ['Trim & Cabinets', 'Interior Paint'] },
      { name: 'Certificate of Occupancy', relatedTaskNames: ['Certificate of Occupancy', 'Final Inspection'] }
    ];

    const project = await tx.project.findUnique({ where: { id: projectId } });

    for (let i = 0; i < milestones.length; i++) {
      const milestone = milestones[i];
      const relatedTaskIds = tasks
        .filter(t => milestone.relatedTaskNames.includes(t.name))
        .map(t => t.id);

      // Calculate target date (spread milestones across project duration)
      const daysFromStart = Math.floor((i + 1) * 
        ((project.plannedEndDate.getTime() - project.plannedStartDate.getTime()) / 
        (24 * 60 * 60 * 1000)) / milestones.length);
      
      const targetDate = new Date(project.plannedStartDate);
      targetDate.setDate(targetDate.getDate() + daysFromStart);

      await tx.milestone.create({
        data: {
          projectId,
          name: milestone.name,
          targetDate,
          relatedTaskIds
        }
      });
    }
  }

  /**
   * Assign project team members
   */
  private async assignProjectTeam(
    tx: any,
    projectId: string,
    offering: any
  ): Promise<void> {
    // Assign sponsor as project owner (if user exists in Organization)
    if (offering.organization.sponsorUserId) {
      // In a real system, create ProjectTeamMember records
      // For now, just log
      console.log('Assigned sponsor to project', {
        projectId,
        sponsorId: offering.organization.sponsorUserId
      });
    }

    // Send welcome notifications
    emit('project.teamAssigned', {
      projectId,
      organizationId: offering.organizationId
    });
  }
}
