import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function RestaurantForm({
    initialRestaurant,
    submitAction,
    buttonLabel = "Create",
}) {
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues: initialRestaurant || {} });
    // Stryker enable all

    const navigate = useNavigate();

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialRestaurant && (
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="RestaurantForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialRestaurant.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3">
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid="RestaurantForm-name"
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="description">Description</Form.Label>
                <Form.Control
                    data-testid="RestaurantForm-description"
                    id="description"
                    type="text"
                    isInvalid={Boolean(errors.description)}
                    {...register("description", {
                        required: "Description is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.description?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="location">Location</Form.Label>
                <Form.Control
                    data-testid="RestaurantForm-location"
                    id="location"
                    type="text"
                    isInvalid={Boolean(errors.location)}
                    {...register("location", {
                        required: true,
                        required: "Location is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.location?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" data-testid="RestaurantForm-submit">
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="RestaurantForm-cancel"
            >
                Cancel
            </Button>
        </Form>
    );
}

export default RestaurantForm;
