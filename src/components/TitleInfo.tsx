// import React from "react";

// interface Rating {
//   Source: string;
//   Value: string;
// }

// interface TitleInfoProps {
//   movie: {
//     Title: string;
//     Year: string;
//     Plot: string;
//     imdbRating: string;
//     Poster?: string;
//     Ratings?: Rating[];
//   };
// }

// const TitleInfo: React.FC<TitleInfoProps> = ({ movie }) => {
//   const { Title, Year, Plot, imdbRating, Poster, Ratings = [] } = movie;

//   const getRatingValue = (source: string) => {
//     return Ratings.find((r) => r.Source === source)?.Value || "N/A";
//   };

//   return (
//     <div className="mt-6 p-4 border rounded shadow flex flex-col items-center text-center max-w-md mx-auto">
//       {Poster && Poster !== "N/A" && (
//         <img
//           src={Poster}
//           alt={`${Title} Poster`}
//           className="w-full max-w-[150px] md:max-w-[200px] h-auto rounded shadow-md object-cover mb-4"
//         />
//       )}
//       <div>
//         <h2 className="text-2xl font-bold">{Title}</h2>
//         <p className="text-gray-700 mb-2">{Year}</p>
//         <p className="text-gray-700 mb-2">{Plot}</p>

//         <div className="text-sm space-y-1">
//           <p>IMDb Rating: {imdbRating}</p>
//           <p>Rotten Tomatoes: {getRatingValue("Rotten Tomatoes")}</p>
//           <p>Metacritic: {getRatingValue("Metacritic")}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TitleInfo;
