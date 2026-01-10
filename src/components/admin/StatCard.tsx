import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  icon: React.ReactNode
  color?: 'green' | 'blue' | 'yellow' | 'red' | 'purple'
}

export default function StatCard({ title, value, change, icon, color = 'green' }: StatCardProps) {
  const colorClasses = {
    green: 'bg-primary-100 text-primary-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-2">{change}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
