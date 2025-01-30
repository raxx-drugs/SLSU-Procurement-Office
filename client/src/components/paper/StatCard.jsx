import React from "react"
import PropTypes from "prop-types"

export const StatCard = React.memo(({ icon: Icon, title, value, color }) => (
  <div className="p-4 bg-white rounded-xl border hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <div className={`p-2 bg-${color}-50 rounded-lg`}>
        <Icon className={`w-5 h-5 text-${color}-600`} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
))

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
}

