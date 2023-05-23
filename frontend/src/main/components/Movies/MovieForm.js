import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function MovieForm({ initialMovie, submitAction, buttonLabel = "Create" }) {
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues: initialMovie || {} });
    // Stryker enable all

    const navigate = useNavigate();

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialMovie && (
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="MovieForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialMovie.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3">
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid="MovieForm-name"
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
                <Form.Label htmlFor="starring">Starring</Form.Label>
                <Form.Control
                    data-testid="MovieForm-starring"
                    id="starring"
                    type="text"
                    isInvalid={Boolean(errors.starring)}
                    {...register("starring", {
                        required: "Starring is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.starring?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="director">Director</Form.Label>
                <Form.Control
                    data-testid="MovieForm-director"
                    id="director"
                    type="text"
                    isInvalid={Boolean(errors.director)}
                    {...register("director", {
                        required: "Director is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.director?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" data-testid="MovieForm-submit">
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="MovieForm-cancel"
            >
                Cancel
            </Button>
        </Form>
    );
}

export default MovieForm;
