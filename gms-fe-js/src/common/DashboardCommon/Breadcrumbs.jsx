import React from 'react'

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
      <aside className="w-full max-w-7xl">
          <aside className="bg-white border-b rounded-xl border-gray-200">
              <div className="px-6 py-4">
                  <article className="flex items-center space-x-2 text-sm text-gray-600">
                      {breadcrumbs.slice(0, -1).map((breadcrumb, index) => (
                          <React.Fragment key={index}>
                              <span>{breadcrumb.label}</span>
                              <span>&gt;</span>
                          </React.Fragment>
                      ))}
                      <span className="text-gray-900 font-medium">{breadcrumbs[breadcrumbs.length - 1]?.label}</span>
                  </article>
              </div>
          </aside>
      </aside>
  )
}

export default Breadcrumbs