// import React from "react";
// import { accessTypes, AccessType } from "@/lib/types";

// interface AccessTypeFiltersProps {
//   selectedTypes: AccessType[];
//   onChange: (type: AccessType) => void;
// }

// const AccessTypeFilters: React.FC<AccessTypeFiltersProps> = ({
//   selectedTypes,
//   onChange,
// }) => {
//   return (
//     <div>
//       <h2 className="text-lg font-semibold mt-4">Access Type</h2>
//       <div className="flex flex-wrap justify-center gap-4">
//         {Object.entries(accessTypes).map(([label, value]) => (
//           <label key={value} className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               value={value}
//               checked={selectedTypes.includes(value)}
//               onChange={() => onChange(value)}
//             />
//             {label}
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AccessTypeFilters;
