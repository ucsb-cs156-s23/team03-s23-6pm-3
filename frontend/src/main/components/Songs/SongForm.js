import React from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function SongForm({ initialSong, submitAction, buttonLabel = "Create" }) {
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues: initialSong || {} });
    // Stryker enable all

    const navigate = useNavigate();

    return (
        <Form onSubmit={handleSubmit(submitAction)}>
            {initialSong && (
                <Form.Group className="mb-3">
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid="SongForm-id"
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialSong.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3">
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                    data-testid="SongForm-title"
                    id="title"
                    type="text"
                    isInvalid={Boolean(errors.title)}
                    {...register("title", {
                        required: "Title is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.title?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="artist">Artist</Form.Label>
                <Form.Control
                    data-testid="SongForm-artist"
                    id="artist"
                    type="text"
                    isInvalid={Boolean(errors.artist)}
                    {...register("artist", {
                        required: "Artist is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.artist?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="album">Album</Form.Label>
                <Form.Control
                    data-testid="SongForm-album"
                    id="album"
                    type="text"
                    isInvalid={Boolean(errors.album)}
                    {...register("album", {
                        required: "Album is required.",
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.album?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" data-testid="SongForm-submit">
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="SongForm-cancel"
            >
                Cancel
            </Button>
        </Form>
    );
}

export default SongForm;
