# Seed Construction Data

This guide explains how to populate the database with sample construction project data.

## Quick Start

```bash
# From the backend directory
cd backend
npx tsx prisma/seed-construction.ts
```

## What Gets Created

The seed script creates a complete construction project with:

### Organization & Users
- RealCo Development (organization)
- Sponsor user (sponsor@realco.com)

### Project Hierarchy
- **Offering**: Sunset Heights Multifamily Development ($12M raise)
- **Development Project**: Sunset Heights Phase 1 (120 units, Los Angeles)
- **Construction Project**: RC-2026-001 (35% complete, $12M budget)

### Construction Data
- **5 Tasks**: Including completed foundation work, ongoing steel framing, and upcoming envelope work
- **2 Daily Logs**: Recent site activity with labor tracking and weather
- **3 RFIs**: HVAC routing clarification, floor finish specs, electrical conflict
- **3 Submittals**: Structural steel (approved), HVAC equipment (under review), windows (submitted)
- **4 Inspections**: Foundation and framing passed, MEP and fire safety scheduled
- **2 Safety Incidents**: Near-miss and first aid incidents with corrective actions

## Sample Data Details

### Construction Project
- **Code**: RC-2026-001
- **Phase**: Construction (35% complete)
- **Budget**: $12M total, $4.2M spent
- **Schedule**: Started June 2025, ends June 2027
- **Performance**: $150K under budget, 5 days ahead of schedule

### Tasks
1. ✅ **Foundation Complete** - 100% done, $850K
2. 🔄 **Structural Steel** - 60% done, $1.2M, In Progress
3. 🔄 **MEP Rough-In** - 45% done, $980K, In Progress
4. ⏳ **Exterior Envelope** - Not started, $750K
5. ⏳ **Interior Finishes** - Not started, $320K

### Daily Logs
- **Jan 23, 2026**: MEP work on Floor 2, city inspector visit, 26 workers
- **Jan 22, 2026**: Framing and concrete work, HVAC delay noted

### RFIs
- **RFI-001**: HVAC duct routing (Answered)
- **RFI-002**: Floor finish material (Pending Response)
- **RFI-003**: Electrical panel conflict (Open)

### Submittals
- **SUB-001**: Structural steel drawings (Approved with notes)
- **SUB-002**: HVAC equipment (Under Review)
- **SUB-003**: Windows and doors (Submitted)

### Inspections
- **INSP-001**: Foundation (Passed ✅)
- **INSP-002**: Framing (Passed ✅)
- **INSP-003**: Rough-In MEP (Scheduled for Jan 27)
- **INSP-004**: Fire Safety (Scheduled for Feb 5)

### Safety Incidents
- **Near-Miss**: Falling lumber incident, corrective actions taken
- **First Aid**: Minor laceration, first aid administered

## After Running Seed

1. **Login** to the sponsor dashboard:
   - Email: sponsor@realco.com
   - Password: (use your existing demo password)

2. **Navigate** to Construction page:
   - `/dashboard/sponsor/construction`

3. **See the data**:
   - Project overview with budget/timeline
   - Active tasks list
   - All sections populated with real data
   - Modals ready to create more data

## Testing the Modals

After seeding, test creating new data:

### Create a New Task
- Click "Add Task" button
- Fill in: "Install Drywall - Floor 3"
- Status: Not Started
- Priority: Medium
- Budget: $180,000
- Submit → Task appears in list

### Create a Daily Log
- Click "Create Daily Log"
- Select weather: Clear
- Add labor: Drywall (6), Taper (4)
- Equipment: Scissor Lift
- Work completed: "Drywall installation Floor 3..."
- Submit → Log created

### Create an RFI
- Click "Create RFI"
- Subject: "Paint color selection - Lobby"
- Description: "Please confirm final paint color..."
- Due date: Pick a date
- Submit → RFI appears

### And so on for:
- Submittals (shop drawings)
- Inspections (schedule building inspections)
- Safety Incidents (report incidents)

## Viewing Existing Data

Click on existing items to edit:
- Click any task card → Edit task modal opens
- Existing RFIs/Submittals/Inspections will have edit functionality

## Re-running the Seed

The script checks for existing data:
- ✅ Safe to run multiple times
- ⚠️ Will skip if construction project already exists
- 💡 To reset: Delete construction project from database first

## Troubleshooting

### "Construction project already exists"
- The seed detected existing data
- Either use existing data or delete it first

### "Cannot find organization"
- Make sure you've run the main seed script first
- Or create an organization manually

### "User not found"
- Create a sponsor user first
- Or update the seed script with your user ID

## Next Steps

After seeding:
1. Explore all sections of the construction dashboard
2. Test creating new records via modals
3. Test editing existing records
4. Verify data auto-refreshes after mutations
5. Check responsive design on different screen sizes

---

**Script Location**: `backend/prisma/seed-construction.ts`
**Created**: January 24, 2026
