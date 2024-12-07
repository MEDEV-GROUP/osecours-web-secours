import React from "react";

const Breadcrumb = ({ paths }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          <span>{path}</span>
          {index < paths.length - 1 && <span className="text-gray-400">›</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
