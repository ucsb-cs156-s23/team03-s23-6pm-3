import React from 'react';
import SongTable from 'main/components/Songs/SongTable';
import { songFixtures } from 'fixtures/songFixtures';

export default {
    title: 'components/Songs/SongTable',
    component: SongTable
};

const Template = (args) => {
    return (
        <SongTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    songs: []
};

export const ThreeSubjectsNoButtons = Template.bind({});

ThreeSubjectsNoButtons.args = {
    songs: songFixtures.threeSongs,
    showButtons: false
};

export const ThreeSubjectsWithButtons = Template.bind({});
ThreeSubjectsWithButtons.args = {
    songs: songFixtures.threeSongs,
    showButtons: true
};
