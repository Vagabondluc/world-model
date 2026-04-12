
import React, { FC } from 'react';
import { css } from '@emotion/css';
import { Modal } from '../common/Modal';
import { Loot } from '../../schemas/loot';

const styles = {
    container: css`
        h4 {
            font-family: var(--header-font);
            color: var(--dnd-red);
            border-bottom: 1px solid var(--border-light);
            padding-bottom: var(--space-xs);
            margin-bottom: var(--space-s);
        }
        ul {
            list-style: disc;
            padding-left: var(--space-l);
        }
        li {
            margin-bottom: var(--space-s);
        }
        p {
            font-size: 1rem;
        }
    `,
};

interface LootResultModalProps {
    loot: Loot;
    onClose: () => void;
}

export const LootResultModal: FC<LootResultModalProps> = ({ loot, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title="Encounter Loot">
            <div className={styles.container}>
                <h4>💰 Coins</h4>
                <p>
                    {loot.gold.gp > 0 && `${loot.gold.gp} GP `}
                    {loot.gold.sp > 0 && `${loot.gold.sp} SP `}
                    {loot.gold.cp > 0 && `${loot.gold.cp} CP`}
                    {loot.gold.gp === 0 && loot.gold.sp === 0 && loot.gold.cp === 0 && "None"}
                </p>

                {loot.items && loot.items.length > 0 && (
                    <>
                        <h4>💎 Items & Valuables</h4>
                        <ul>
                            {loot.items.map((item, i) => (
                                <li key={i}>
                                    <strong>{item.name}</strong>{item.description ? ` — ${item.description}` : ''}
                                </li>
                            ))}
                        </ul>
                    </>
                )}

                {loot.hooks && loot.hooks.length > 0 && (
                    <>
                        <h4>📌 Hooks</h4>
                        <ul>
                            {loot.hooks.map((hook, i) => <li key={i}>{hook}</li>)}
                        </ul>
                    </>
                )}
            </div>
        </Modal>
    );
};
