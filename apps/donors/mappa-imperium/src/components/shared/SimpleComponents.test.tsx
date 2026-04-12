/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import ConfirmationModal from './ConfirmationModal';
import EraButton from './EraButton';
import ObserverMode from './ObserverMode';
import ReferenceTableModal from './ReferenceTableModal';
import EmojiPicker from './EmojiPicker';
import MarkdownRenderer from './MarkdownRenderer';

describe('ConfirmationModal', () => {
    it('renders when open', () => {
        render(<ConfirmationModal isOpen={true} title="Confirm" message="Are you sure?" onConfirm={() => { }} onClose={() => { }} />);
        expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    });
});

describe('EraButton', () => {
    it('renders era name', () => {
        render(<EraButton label="Era 1" onClick={() => { }} />);
        expect(screen.getByText('Era 1')).toBeInTheDocument();
    });
});

describe('ObserverMode', () => {
    it('renders observer message', () => {
        const { container } = render(<ObserverMode />);
        expect(screen.getByText('Observer Mode')).toBeInTheDocument();
    });
});

describe('ReferenceTableModal', () => {
    it('renders title when open', () => {
        render(<ReferenceTableModal isOpen={true} onClose={() => { }} />);
        expect(screen.getByText('Reference Table')).toBeInTheDocument();
    });
});

describe('EmojiPicker', () => {
    it('renders when open', () => {
        // EmojiPicker usually expects ref. Or maybe not.
        render(<EmojiPicker isOpen={true} onClose={() => { }} onSelect={() => { }} triggerRef={{ current: document.createElement('div') } as any} />);
        // Checking button count or specific emoji if search absent
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
    });
});

describe('MarkdownRenderer', () => {
    it('renders markdown content', () => {
        render(<MarkdownRenderer content="# Hello" />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello');
    });
});
