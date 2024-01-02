import { EditableText as EditableTextComponent, EditableTextProps } from './EditableText';

export default {
    title: 'Misc/EditableText',

    args: {
        originalValue: 'original value',
        defaultVisibleValue: 'default visible value',
        onSubmit: () => {
            console.log('onSubmit');
        },
        onBlur: () => {
            console.log('onBlur');
        },
    },
};

export const EditableText = {
    render: (props: EditableTextProps) => <EditableTextComponent {...props} />,
};
