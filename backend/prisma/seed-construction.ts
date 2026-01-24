import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedConstruction() {
  console.log('🏗️  Starting construction data seed...')

  try {
    // Find or create an organization
    let org = await prisma.organization.findFirst()

    if (!org) {
      console.log('Creating organization...')
      org = await prisma.organization.create({
        data: {
          name: 'RealCo Development',
          type: 'SPONSOR',
          email: 'sponsor@realco.com',
          phone: '555-0100',
        },
      })
      console.log('✅ Organization created:', org.name)
    } else {
      console.log('✅ Using existing organization:', org.name)
    }

    // Find or create a user (sponsor)
    let user = await prisma.user.findFirst({
      where: { orgId: org.id },
    })

    if (!user) {
      console.log('Creating sponsor user...')
      user = await prisma.user.create({
        data: {
          email: 'sponsor@realco.com',
          passwordHash: '$2b$10$XYZ...', // Dummy hash
          firstName: 'John',
          lastName: 'Sponsor',
          role: 'SPONSOR',
          orgId: org.id,
          emailVerified: true,
        },
      })
      console.log('✅ Sponsor user created')
    } else {
      console.log('✅ Using existing user:', user.email)
    }

    // Create or find a development project (offering)
    let offering = await prisma.offering.findFirst({
      where: { orgId: org.id },
    })

    if (!offering) {
      console.log('Creating offering...')
      offering = await prisma.offering.create({
        data: {
          name: 'Sunset Heights Multifamily Development',
          description: '120-unit luxury apartment complex with retail space',
          offeringType: 'EQUITY',
          assetClass: 'MULTIFAMILY',
          targetRaise: 12000000,
          minInvestment: 50000,
          expectedReturn: 18.5,
          investmentTerm: 36,
          status: 'ACTIVE',
          orgId: org.id,
          createdById: user.id,
        },
      })
      console.log('✅ Offering created:', offering.name)
    } else {
      console.log('✅ Using existing offering:', offering.name)
    }

    // Create development project
    let devProject = await prisma.developmentProject.findFirst({
      where: { offeringId: offering.id },
    })

    if (!devProject) {
      console.log('Creating development project...')
      devProject = await prisma.developmentProject.create({
        data: {
          name: 'Sunset Heights Phase 1',
          address: '1234 Sunset Boulevard, Los Angeles, CA 90028',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90028',
          propertyType: 'MULTIFAMILY',
          units: 120,
          squareFeet: 180000,
          acquisitionCost: 8500000,
          totalBudget: 12000000,
          offeringId: offering.id,
          orgId: org.id,
        },
      })
      console.log('✅ Development project created')
    } else {
      console.log('✅ Using existing development project')
    }

    // Check if construction project already exists
    const existingProject = await prisma.project.findFirst({
      where: { developmentProjectId: devProject.id },
    })

    if (existingProject) {
      console.log('⚠️  Construction project already exists. Skipping seed.')
      return
    }

    // Create construction project
    console.log('Creating construction project...')
    const project = await prisma.project.create({
      data: {
        projectCode: `RC-2026-001`,
        phase: 'CONSTRUCTION',
        percentComplete: 35,
        totalBudget: 12000000,
        spentToDate: 4200000,
        plannedStartDate: new Date('2025-06-01'),
        actualStartDate: new Date('2025-06-15'),
        plannedEndDate: new Date('2027-06-01'),
        costVariance: -150000, // Under budget
        scheduleVarianceDays: 5, // Ahead of schedule
        developmentProjectId: devProject.id,
        projectManagerId: user.id,
      },
    })
    console.log('✅ Construction project created:', project.projectCode)

    // Create tasks
    console.log('Creating tasks...')
    const tasks = await prisma.task.createMany({
      data: [
        {
          projectId: project.id,
          title: 'Foundation and Grading Complete',
          description: 'Complete site grading and foundation work for Building A',
          status: 'COMPLETED',
          priority: 'CRITICAL',
          percentComplete: 100,
          plannedStartDate: new Date('2025-06-15'),
          plannedEndDate: new Date('2025-08-30'),
          actualStartDate: new Date('2025-06-15'),
          actualEndDate: new Date('2025-08-25'),
          durationDays: 71,
          budgetAmount: 850000,
          assignedToId: user.id,
        },
        {
          projectId: project.id,
          title: 'Structural Steel Framing - Building A',
          description: 'Install structural steel frame for 6-story building',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          percentComplete: 60,
          plannedStartDate: new Date('2025-09-01'),
          plannedEndDate: new Date('2025-11-15'),
          actualStartDate: new Date('2025-09-01'),
          durationDays: 75,
          budgetAmount: 1200000,
          assignedToId: user.id,
        },
        {
          projectId: project.id,
          title: 'MEP Rough-In - Floors 1-3',
          description: 'Mechanical, electrical, and plumbing rough-in for lower floors',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          percentComplete: 45,
          plannedStartDate: new Date('2025-10-01'),
          plannedEndDate: new Date('2026-01-30'),
          actualStartDate: new Date('2025-10-01'),
          durationDays: 121,
          budgetAmount: 980000,
          assignedToId: user.id,
        },
        {
          projectId: project.id,
          title: 'Exterior Envelope - Building A',
          description: 'Install exterior cladding, windows, and waterproofing',
          status: 'NOT_STARTED',
          priority: 'MEDIUM',
          percentComplete: 0,
          plannedStartDate: new Date('2026-02-01'),
          plannedEndDate: new Date('2026-05-15'),
          durationDays: 104,
          budgetAmount: 750000,
        },
        {
          projectId: project.id,
          title: 'Interior Finishes - Model Units',
          description: 'Complete interior finishes for 6 model apartment units',
          status: 'NOT_STARTED',
          priority: 'LOW',
          percentComplete: 0,
          plannedStartDate: new Date('2026-06-01'),
          plannedEndDate: new Date('2026-08-30'),
          durationDays: 90,
          budgetAmount: 320000,
        },
      ],
    })
    console.log(`✅ Created ${tasks.count} tasks`)

    // Create daily logs
    console.log('Creating daily logs...')
    const dailyLogs = await prisma.dailyLog.createMany({
      data: [
        {
          projectId: project.id,
          logDate: new Date('2026-01-23'),
          weather: 'CLEAR',
          temperature: 68,
          laborCount: [
            { trade: 'Carpenter', count: 12 },
            { trade: 'Electrician', count: 8 },
            { trade: 'Plumber', count: 6 },
          ],
          equipmentUsed: ['Crane (50-ton)', 'Scissor Lift (3)', 'Forklift'],
          workCompleted: 'Completed MEP rough-in on Floor 2 East Wing. Installed 24 electrical junction boxes and ran conduit for lighting circuits. Plumbing team completed domestic water rough-in.',
          materialsDelivered: '480 sheets 5/8" drywall, 120 boxes electrical boxes, HVAC ductwork for Floor 3',
          visitorLog: 'City Building Inspector (J. Martinez) - MEP inspection Floor 1',
          safetyObservations: 'Excellent PPE compliance. Reminded crew about fall protection near edge of Floor 3.',
          createdById: user.id,
        },
        {
          projectId: project.id,
          logDate: new Date('2026-01-22'),
          weather: 'CLOUDY',
          temperature: 65,
          laborCount: [
            { trade: 'Carpenter', count: 10 },
            { trade: 'Electrician', count: 8 },
            { trade: 'Laborer', count: 4 },
          ],
          equipmentUsed: ['Crane (50-ton)', 'Scissor Lift (2)', 'Concrete Pump'],
          workCompleted: 'Framing crew completed interior walls Floor 2. Electrical rough-in progressing on schedule. Concrete pour for Floor 3 deck completed.',
          materialsDelivered: '2x4 lumber (800 linear feet), Romex wire (4000 feet)',
          issuesDelays: 'Delayed delivery of HVAC equipment - rescheduled for tomorrow',
          safetyObservations: 'Near-miss: Material almost fell from Floor 3 - reminded crew about securing loads',
          createdById: user.id,
        },
      ],
    })
    console.log(`✅ Created ${dailyLogs.count} daily logs`)

    // Create RFIs
    console.log('Creating RFIs...')
    const rfis = await prisma.rFI.createMany({
      data: [
        {
          projectId: project.id,
          rfiNumber: 'RFI-001',
          subject: 'Clarification on HVAC duct routing - Floor 2',
          description: 'The structural drawings show a beam location that conflicts with the HVAC duct routing shown in M-301. Please clarify the intended duct path or if the beam can be relocated.',
          status: 'ANSWERED',
          dueDate: new Date('2026-01-20'),
          response: 'Per coordination meeting, HVAC duct will be rerouted along the north wall. Revised routing shown in sketch RFI-001-SK1. Beam location remains as shown on structural drawings.',
          submittedById: user.id,
          respondedById: user.id,
          respondedAt: new Date('2026-01-19'),
        },
        {
          projectId: project.id,
          rfiNumber: 'RFI-002',
          subject: 'Floor finish material specification - Common Areas',
          description: 'Specification Section 09 65 00 lists "Resilient Tile Flooring" but does not specify LVT or VCT. Please confirm which product is specified for common area corridors.',
          status: 'PENDING_RESPONSE',
          dueDate: new Date('2026-01-28'),
          submittedById: user.id,
        },
        {
          projectId: project.id,
          rfiNumber: 'RFI-003',
          subject: 'Electrical panel location conflict',
          description: 'Electrical panel EP-2A location conflicts with plumbing chase. Need coordination or panel relocation.',
          status: 'OPEN',
          dueDate: new Date('2026-01-30'),
          submittedById: user.id,
        },
      ],
    })
    console.log(`✅ Created ${rfis.count} RFIs`)

    // Create submittals
    console.log('Creating submittals...')
    const submittals = await prisma.submittal.createMany({
      data: [
        {
          projectId: project.id,
          submittalNumber: 'SUB-001',
          name: 'Structural Steel Shop Drawings',
          description: 'Shop drawings for structural steel frame - Buildings A & B',
          specSection: '05 12 00',
          status: 'APPROVED',
          submittedDate: new Date('2025-07-15'),
          reviewerNotes: 'Approved as noted. Minor dimension corrections required on sheets S-12 and S-18. Resubmit marked sheets only.',
          submittedById: user.id,
          reviewedById: user.id,
          reviewedAt: new Date('2025-07-22'),
        },
        {
          projectId: project.id,
          submittalNumber: 'SUB-002',
          name: 'HVAC Equipment Schedule',
          description: 'Product data for rooftop HVAC units and air handlers',
          specSection: '23 74 00',
          status: 'UNDER_REVIEW',
          submittedDate: new Date('2026-01-15'),
          submittedById: user.id,
        },
        {
          projectId: project.id,
          submittalNumber: 'SUB-003',
          name: 'Window and Door Schedule',
          description: 'Shop drawings and product data for aluminum window wall system',
          specSection: '08 44 00',
          status: 'SUBMITTED',
          submittedDate: new Date('2026-01-20'),
          submittedById: user.id,
        },
      ],
    })
    console.log(`✅ Created ${submittals.count} submittals`)

    // Create inspections
    console.log('Creating inspections...')
    const inspections = await prisma.inspection.createMany({
      data: [
        {
          projectId: project.id,
          inspectionNumber: 'INSP-001',
          inspectionType: 'Foundation',
          scheduledDate: new Date('2025-08-20'),
          status: 'COMPLETED',
          result: 'PASSED',
          inspector: 'J. Martinez - City Building Dept',
          notes: 'Foundation inspection passed. All rebar placement and concrete pour meet code requirements.',
          completedDate: new Date('2025-08-20'),
          scheduledById: user.id,
        },
        {
          projectId: project.id,
          inspectionNumber: 'INSP-002',
          inspectionType: 'Framing',
          scheduledDate: new Date('2025-10-15'),
          status: 'COMPLETED',
          result: 'PASSED',
          inspector: 'J. Martinez - City Building Dept',
          notes: 'Framing inspection Floor 1-2 passed.',
          completedDate: new Date('2025-10-15'),
          scheduledById: user.id,
        },
        {
          projectId: project.id,
          inspectionNumber: 'INSP-003',
          inspectionType: 'Rough-In MEP',
          scheduledDate: new Date('2026-01-27'),
          status: 'SCHEDULED',
          inspector: 'J. Martinez - City Building Dept',
          scheduledById: user.id,
        },
        {
          projectId: project.id,
          inspectionNumber: 'INSP-004',
          inspectionType: 'Fire Safety',
          scheduledDate: new Date('2026-02-05'),
          status: 'SCHEDULED',
          inspector: 'Fire Marshal - LAFD',
          scheduledById: user.id,
        },
      ],
    })
    console.log(`✅ Created ${inspections.count} inspections`)

    // Create safety incidents
    console.log('Creating safety incidents...')
    const safetyIncidents = await prisma.safetyIncident.createMany({
      data: [
        {
          projectId: project.id,
          incidentType: 'NEAR_MISS',
          incidentDate: new Date('2026-01-22'),
          location: 'Floor 3 East Wing',
          description: 'Worker nearly struck by falling 2x4 lumber. Material was not properly secured before crane lift. No injuries occurred.',
          oshaReportable: false,
          correctiveActions: 'Conducted toolbox talk on material handling and securing loads. Implemented additional inspection protocol before all crane lifts. Posted new signage in crane operating areas.',
          reportedById: user.id,
        },
        {
          projectId: project.id,
          incidentType: 'FIRST_AID',
          incidentDate: new Date('2025-12-10'),
          location: '1st Floor - West Stairwell',
          description: 'Carpenter sustained minor laceration to left hand while cutting lumber. First aid administered on site.',
          oshaReportable: false,
          correctiveActions: 'First aid provided. Worker reminded about proper tool handling procedures. Glove usage emphasized.',
          reportedById: user.id,
        },
      ],
    })
    console.log(`✅ Created ${safetyIncidents.count} safety incidents`)

    console.log('\n🎉 Construction data seed completed successfully!\n')
    console.log('Summary:')
    console.log(`- Organization: ${org.name}`)
    console.log(`- Project: ${project.projectCode}`)
    console.log(`- Tasks: ${tasks.count}`)
    console.log(`- Daily Logs: ${dailyLogs.count}`)
    console.log(`- RFIs: ${rfis.count}`)
    console.log(`- Submittals: ${submittals.count}`)
    console.log(`- Inspections: ${inspections.count}`)
    console.log(`- Safety Incidents: ${safetyIncidents.count}`)
    console.log('\nYou can now view this data in the construction dashboard!')

  } catch (error) {
    console.error('❌ Error seeding construction data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedConstruction()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
