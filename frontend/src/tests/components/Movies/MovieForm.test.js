import { render, waitFor, fireEvent } from "@testing-library/react";
import MovieForm from "main/components/Movies/MovieForm";
import { ucsbDatesFixtures } from "fixtures/ucsbDatesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

describe("MovieForm tests", () => {
    test("renders correctly", async () => {
        const { getByText, findByText } = render(
            <Router>
                <MovieForm />
            </Router>
        );
        await findByText(/Name/);
        await findByText(/Create/);
    });

    test("renders correctly when passing in a Movie", async () => {
        const { getByText, getByTestId, findByTestId } = render(
            <Router>
                <MovieForm initialMovie={ucsbDatesFixtures.oneDate} />
            </Router>
        );
        await findByTestId(/MovieForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/MovieForm-id/)).toHaveValue("1");
    });

    test("Correct Error messsages on missing input", async () => {
        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router>
                <MovieForm />
            </Router>
        );
        await findByTestId("MovieForm-submit");
        const submitButton = getByTestId("MovieForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Name is required./);
        expect(getByText(/Name is required./)).toBeInTheDocument();
        expect(getByText(/Starring is required./)).toBeInTheDocument();
        expect(getByText(/Director is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {
        const mockSubmitAction = jest.fn();

        const { getByTestId, queryByText, findByTestId } = render(
            <Router>
                <MovieForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("MovieForm-name");

        const nameField = getByTestId("MovieForm-name");
        const starringField = getByTestId("MovieForm-starring");
        const directorField = getByTestId("MovieForm-director");
        const submitButton = getByTestId("MovieForm-submit");

        fireEvent.change(nameField, { target: { value: "Name1" } });
        fireEvent.change(starringField, {
            target: { value: "Starring1" },
        });
        fireEvent.change(directorField, {
            target: { value: "Director1" },
        });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Name is required./)).not.toBeInTheDocument();
        expect(queryByText(/Starring is required./)).not.toBeInTheDocument();
        expect(queryByText(/Director is required./)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        const { getByTestId, findByTestId } = render(
            <Router>
                <MovieForm />
            </Router>
        );
        await findByTestId("MovieForm-cancel");
        const cancelButton = getByTestId("MovieForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});
