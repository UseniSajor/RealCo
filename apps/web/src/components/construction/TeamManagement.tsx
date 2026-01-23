"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Mail, 
  Phone,
  Plus,
  UserPlus,
  Shield,
  AlertCircle
} from "lucide-react"

export function TeamManagement() {
  const [showAddMemberForm, setShowAddMemberForm] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CONTRACTOR',
    company: '',
    trade: '',
  })

  // Mock team data
  const teamMembers = [
    {
      id: 'TM-001',
      name: 'John Smith',
      email: 'john.smith@realco.com',
      phone: '(555) 123-4567',
      role: 'PROJECT_MANAGER',
      company: 'RealCo Development',
      status: 'ACTIVE',
      avatar: 'JS',
      lastActive: '2 hours ago',
      tasksAssigned: 12,
      tasksCompleted: 8,
    },
    {
      id: 'TM-002',
      name: 'Sarah Johnson',
      email: 'sarah@abcsteel.com',
      phone: '(555) 234-5678',
      role: 'CONTRACTOR',
      company: 'ABC Steel Fabrication',
      trade: 'Structural Steel',
      status: 'ACTIVE',
      avatar: 'SJ',
      lastActive: '1 day ago',
      tasksAssigned: 8,
      tasksCompleted: 7,
    },
    {
      id: 'TM-003',
      name: 'Mike Chen',
      email: 'mike@xyzelectric.com',
      phone: '(555) 345-6789',
      role: 'CONTRACTOR',
      company: 'XYZ Electrical',
      trade: 'Electrical',
      status: 'ACTIVE',
      avatar: 'MC',
      lastActive: '5 hours ago',
      tasksAssigned: 15,
      tasksCompleted: 12,
    },
    {
      id: 'TM-004',
      name: 'Emily Rodriguez',
      email: 'emily@abcarch.com',
      phone: '(555) 456-7890',
      role: 'ARCHITECT',
      company: 'ABC Architecture',
      status: 'ACTIVE',
      avatar: 'ER',
      lastActive: '3 hours ago',
      tasksAssigned: 6,
      tasksCompleted: 4,
    },
    {
      id: 'TM-005',
      name: 'David Brown',
      email: 'david@defeng.com',
      phone: '(555) 567-8901',
      role: 'ENGINEER',
      company: 'DEF Engineering',
      status: 'ACTIVE',
      avatar: 'DB',
      lastActive: '1 hour ago',
      tasksAssigned: 10,
      tasksCompleted: 9,
    },
    {
      id: 'TM-006',
      name: 'Lisa Anderson',
      email: 'lisa@premiumpaint.com',
      phone: '(555) 678-9012',
      role: 'CONTRACTOR',
      company: 'Premium Painters LLC',
      trade: 'Painting',
      status: 'INACTIVE',
      avatar: 'LA',
      lastActive: '2 weeks ago',
      tasksAssigned: 5,
      tasksCompleted: 5,
    },
  ]

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'PROJECT_MANAGER': return 'bg-purple-500 text-white'
      case 'ARCHITECT': return 'bg-blue-500 text-white'
      case 'ENGINEER': return 'bg-green-500 text-white'
      case 'CONTRACTOR': return 'bg-orange-500 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      : 'bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-200'
  }

  const handleAddMember = () => {
    console.log('New team member:', newMember)
    setShowAddMemberForm(false)
    setNewMember({
      name: '',
      email: '',
      phone: '',
      role: 'CONTRACTOR',
      company: '',
      trade: '',
    })
  }

  const activeMembers = teamMembers.filter(m => m.status === 'ACTIVE')
  const totalTasks = teamMembers.reduce((sum, m) => sum + m.tasksAssigned, 0)
  const completedTasks = teamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Team Management</h2>
          <p className="text-base text-muted-foreground">
            Manage project team members and their roles
          </p>
        </div>
        <Button 
          className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
          onClick={() => setShowAddMemberForm(!showAddMemberForm)}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Members</p>
              <Users className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {teamMembers.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {activeMembers.length} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Members</p>
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600">
              {activeMembers.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Currently working
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <AlertCircle className="h-5 w-5 text-[#E07A47]" />
            </div>
            <p className="text-3xl font-black text-[#E07A47]">
              {totalTasks}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Assigned to team
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completion</p>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-purple-600">
              {Math.round((completedTasks / totalTasks) * 100)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {completedTasks} of {totalTasks} done
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Member Form */}
      {showAddMemberForm && (
        <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
          <CardHeader>
            <CardTitle>Add Team Member</CardTitle>
            <CardDescription>Invite a new member to the project team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Full Name</label>
                <input
                  type="text"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="john@company.com"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="ARCHITECT">Architect</option>
                  <option value="ENGINEER">Engineer</option>
                  <option value="CONTRACTOR">Contractor</option>
                  <option value="INSPECTOR">Inspector</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Company</label>
                <input
                  type="text"
                  value={newMember.company}
                  onChange={(e) => setNewMember({...newMember, company: e.target.value})}
                  placeholder="Company Name LLC"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Trade (if contractor)</label>
                <input
                  type="text"
                  value={newMember.trade}
                  onChange={(e) => setNewMember({...newMember, trade: e.target.value})}
                  placeholder="e.g., Electrical, Plumbing"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-[#56CCF2] hover:bg-[#56CCF2]/90" onClick={handleAddMember}>
                Send Invitation
              </Button>
              <Button variant="outline" onClick={() => setShowAddMemberForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="border-2 border-slate-200 dark:border-[#E07A47]">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[#56CCF2] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{member.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{member.company}</p>
                    </div>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status}
                    </Badge>
                  </div>

                  <Badge className={`${getRoleColor(member.role)} mb-3`}>
                    {member.role.replace(/_/g, ' ')}
                  </Badge>

                  {member.trade && (
                    <Badge variant="outline" className="mb-3 ml-2">
                      {member.trade}
                    </Badge>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-muted/50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Tasks</p>
                        <p className="font-bold">{member.tasksCompleted}/{member.tasksAssigned}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Last Active</p>
                        <p className="font-bold">{member.lastActive}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
