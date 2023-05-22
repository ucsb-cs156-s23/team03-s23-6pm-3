import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RestaurantsCreatePage() {
    const objectToAxiosParams = (restaurant) => ({
        url: "/api/restaurants/post",
        method: "POST",
        params: {
            name: restaurant.name,
            description: restaurant.description,
            location: restaurant.location,
        },
    });

    const onSuccess = (restaurant) => {
        toast(
            `New restaurant created - id: ${restaurant.id} name: ${restaurant.name}`
        );
    };

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/restaurants/all"]
    );

    const { isSuccess } = mutation;

    const onSubmit = async (data) => {
        mutation.mutate(data);
    };

    if (isSuccess) {
        return <Navigate to="/restaurants/list" />;
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Create New Restaurant</h1>

                <RestaurantForm submitAction={onSubmit} />
            </div>
        </BasicLayout>
    );
}
