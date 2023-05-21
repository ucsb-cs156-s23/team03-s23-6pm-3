// import React from "react";
// import { useBackend } from "main/utils/useBackend";

// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
// import RestaurantTable from "main/components/Restaurant/RestaurantTable";
// import { useCurrentUser } from "main/utils/currentUser";

// export default function RestaurantIndexPage() {
//     const currentUser = useCurrentUser();

//     const {
//         data: restaurants,
//         error: _error,
//         status: _status,
//     } = useBackend(
//         // Stryker disable next-line all : don't test internal caching of React Query
//         ["/api/restaurant/all"],
//         { method: "GET", url: "/api/restaurant/all" },
//         []
//     );

//     return (
//         <BasicLayout>
//             <div className="pt-2">
//                 <h1>Restaurant</h1>
//                 <RestaurantTable
//                     restaurants={restaurants}
//                     currentUser={currentUser}
//                 />
//             </div>
//         </BasicLayout>
//     );
// }
