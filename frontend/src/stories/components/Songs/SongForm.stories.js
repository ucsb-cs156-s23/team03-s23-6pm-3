import React from 'react';
import SongForm from "main/components/Songs/SongForm"
import { songFixtures } from 'fixtures/songFixtures';

export default {
    title: 'components/Songs/SongForm',
    component: SongForm
};

const Template = (args) => {
    return (
        <SongForm {...args} />
    )
};

export const Default = Template.bind({});

Default.args = {
    submitText: "Create",
    submitAction: () => { console.log("Submit was clicked"); }
};

export const Show = Template.bind({});

Show.args = {
    Song: songFixtures.oneSong,
    submitText: "",
    submitAction: () => { }
};