import React from "react";
import MovieTable from "main/components/Movies/MovieTable";
import { movieFixtures } from "fixtures/movieFixtures";

export default {
    title: "components/Movies/MovieTable",
    component: MovieTable,
};

const Template = (args) => {
    return <MovieTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
    movies: [],
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    movies: movieFixtures.threeMovies,
    showButtons: false,
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    movies: movieFixtures.threeMovies,
    showButtons: true,
};
