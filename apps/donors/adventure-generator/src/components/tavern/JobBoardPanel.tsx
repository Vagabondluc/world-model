import { useMemo, useState } from 'react';
import { css } from '@emotion/css';
import { useTavernStore } from '../../stores/tavernStore';
import { useAppContext } from '../../context/AppContext';
import { JOB_THEMES } from '../../data/jobData';
import { JobCard } from './JobCard';
import { useCampaignStore } from '../../stores/campaignStore';
import { useLocationStore } from '../../stores/locationStore';
import { useEncounterWizardStore } from '../../stores/encounterWizardStore';
import { JobPost } from '../../schemas/tavern';
import { JobContext, JobPost as ProceduralJobPost } from '../../types/jobGenerator';

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: var(--space-l);
    `,
    controls: css`
        display: grid;
        grid-template-columns: 2fr 1fr auto auto;
        gap: var(--space-m);
        align-items: end;
        padding-bottom: var(--space-l);
        border-bottom: 1px solid var(--border-light);

        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }
    `,
    grid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--space-l);
    `,
    emptyState: css`
        text-align: center;
        padding: var(--space-xxl);
        color: var(--medium-brown);
        font-style: italic;
        background: rgba(0,0,0,0.03);
        border-radius: var(--border-radius);
    `
};

export const JobBoardPanel: React.FC = () => {
    const { apiService } = useAppContext();
    const { jobPosts, aiLoading, generateJobPosts, generateProceduralJobs } = useTavernStore();
    const { setActiveView } = useCampaignStore();
    const { initializeFromJob } = useEncounterWizardStore();
    
    // Context sourcing from map
    const activeMapId = useLocationStore(s => s.activeMapId);
    const viewSettings = useLocationStore(s => s.getViewSettings());
    const hexBiomes = useLocationStore(s => s.getHexBiomes());

    const [setting, setSetting] = useState('');
    const [theme, setTheme] = useState(JOB_THEMES[0]);

    const allowedBiomes: NonNullable<JobContext['biome']>[] = [
        'plains',
        'forest',
        'swamp',
        'mountain',
        'desert',
        'coast',
        'underdark',
        'urban'
    ];

    const resolveBiome = (value: string | undefined): NonNullable<JobContext['biome']> => {
        if (value && allowedBiomes.includes(value as NonNullable<JobContext['biome']>)) {
            return value as NonNullable<JobContext['biome']>;
        }
        return 'plains';
    };

    const currentBiome = useMemo<NonNullable<JobContext['biome']>>(() => {
        if (!activeMapId) return 'urban';
        const center = viewSettings.centerCoordinate || { q: 0, r: 0 };
        return resolveBiome(hexBiomes[`${center.q},${center.r}`]);
    }, [activeMapId, viewSettings.centerCoordinate, hexBiomes]);

    const handleGenerateAI = () => {
        if (apiService) {
            generateJobPosts(apiService, setting || `The ${currentBiome} around you`, theme);
        }
    };

    const handleGenerateProcedural = () => {
        generateProceduralJobs({
            biome: currentBiome,
            dangerRating: 3,
            partyLevel: 5,
            regionName: setting || undefined
        });
    };

    const handleDesignEncounter = (job: JobPost | ProceduralJobPost) => {
        initializeFromJob(job);
        setActiveView('encounter-designer');
    };

    return (
        <div className={styles.container}>
            <div className={styles.controls}>
                <div className="form-group" style={{marginBottom: 0}}>
                    <label>Setting / Context</label>
                    <input 
                        type="text" 
                        value={setting} 
                        onChange={(e) => setSetting(e.target.value)} 
                        placeholder={`Near current ${currentBiome}...`} 
                    />
                </div>
                <div className="form-group" style={{marginBottom: 0}}>
                    <label>Theme</label>
                    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        {JOB_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <button 
                    className="primary-button" 
                    onClick={handleGenerateAI} 
                    disabled={aiLoading}
                    style={{height: '42px', fontSize: '1rem'}}
                    title="Generate detailed quest hooks via AI."
                >
                    {aiLoading ? <><span className="loader"></span> Conjuring...</> : '✨ Ask AI'}
                </button>
                <button 
                    className="secondary-button" 
                    onClick={handleGenerateProcedural} 
                    disabled={aiLoading}
                    style={{height: '42px', fontSize: '1rem'}}
                    title="Instantly generate quests from local patterns."
                >
                    ⚡ Quick Post
                </button>
            </div>

            {jobPosts.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>The job board is empty. Choose a theme and click generate to post some contracts.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {jobPosts.map((job, idx) => (
                        <JobCard key={idx} job={job} onDesignEncounter={handleDesignEncounter} />
                    ))}
                </div>
            )}
        </div>
    );
};
