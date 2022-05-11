import styled from "styled-components";
import { MiniCard } from "@ghs-wdc/storybook";
import Note from "../../types/db/note.type";
import { DateTime } from "luxon";

interface GroupProps {
    notes: Note[];
    label: string;
}

export default function Group({ label, notes }: GroupProps) {
    return (
        <GContainer>
            <h1>{label}</h1>
            {notes.map(note => <MiniCard title={note.title} />)}
        </GContainer>
    );
}

const GContainer = styled.div`

`;