import JourneyVisualizer from '@/components/journey/JourneyVisualizer';

export default async function JourneyVisualizerPage(
    props: {
        params: Promise<{ slug: string }>;
    }
) {
    const params = await props.params;
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Journey Visualizer: {params.slug}</h1>
            <JourneyVisualizer slug={params.slug} />
        </div>
    );
}
