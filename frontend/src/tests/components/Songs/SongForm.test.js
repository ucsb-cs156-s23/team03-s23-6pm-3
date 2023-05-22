import { render, waitFor, fireEvent } from "@testing-library/react";
import SongForm from "main/components/Songs/SongForm";
import { ucsbDatesFixtures } from "fixtures/ucsbDatesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate,
}));

describe("SongForm tests", () => {
    test("renders correctly", async () => {
        const { getByText, findByText } = render(
            <Router>
                <SongForm />
            </Router>
        );
        await findByText(/Title/);
        await findByText(/Create/);
    });

    test("renders correctly when passing in a Song", async () => {
        const { getByText, getByTestId, findByTestId } = render(
            <Router>
                <SongForm initialSong={ucsbDatesFixtures.oneDate} />
            </Router>
        );
        await findByTestId(/SongForm-id/);
        expect(getByText(/Id/)).toBeInTheDocument();
        expect(getByTestId(/SongForm-id/)).toHaveValue("1");
    });

    test("Correct Error messsages on missing input", async () => {
        const { getByTestId, getByText, findByTestId, findByText } = render(
            <Router>
                <SongForm />
            </Router>
        );
        await findByTestId("SongForm-submit");
        const submitButton = getByTestId("SongForm-submit");

        fireEvent.click(submitButton);

        await findByText(/Title is required./);
        expect(getByText(/Title is required./)).toBeInTheDocument();
        expect(getByText(/Artist is required./)).toBeInTheDocument();
        expect(getByText(/Album is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {
        const mockSubmitAction = jest.fn();

        const { getByTestId, queryByText, findByTestId } = render(
            <Router>
                <SongForm submitAction={mockSubmitAction} />
            </Router>
        );
        await findByTestId("SongForm-title");

        const titleField = getByTestId("SongForm-title");
        const artistField = getByTestId("SongForm-artist");
        const albumField = getByTestId("SongForm-album");
        const submitButton = getByTestId("SongForm-submit");

        fireEvent.change(titleField, { target: { value: "Title1" } });
        fireEvent.change(artistField, {
            target: { value: "Artist1" },
        });
        fireEvent.change(albumField, {
            target: { value: "Album1" },
        });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(queryByText(/Title is required./)).not.toBeInTheDocument();
        expect(queryByText(/Artist is required./)).not.toBeInTheDocument();
        expect(queryByText(/Album is required./)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        const { getByTestId, findByTestId } = render(
            <Router>
                <SongForm />
            </Router>
        );
        await findByTestId("SongForm-cancel");
        const cancelButton = getByTestId("SongForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});
