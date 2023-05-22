import React from 'react';
import MovieForm from "main/components/Movies/MovieForm"
import { movieFixtures } from 'fixtures/movieFixtures';

export default {
    title: 'components/Movies/MovieForm',
    component: MovieForm
};

const Template = (args) => {
    return (
        <MovieForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Movie: movieFixtures.oneMovie,
    submitText: "",
    submitAction: () => { }
};