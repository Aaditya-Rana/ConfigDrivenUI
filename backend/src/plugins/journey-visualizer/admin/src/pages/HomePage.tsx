import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  SingleSelect,
  SingleSelectOption,
  Flex,
  Loader,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { PLUGIN_ID } from '../pluginId';
import { JourneyGraph } from '../components/JourneyGraph';

interface Journey {
  id: string;
  name: string;
  slug: string;
}

interface GraphData {
  nodes: any[];
  edges: any[];
  journeyName: string;
}

const HomePage = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loadingJourneys, setLoadingJourneys] = useState(true);
  const [loadingGraph, setLoadingGraph] = useState(false);

  const { get } = useFetchClient();

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const { data } = await get(`/journey-visualizer/journeys`);
        setJourneys(data);
        if (data.length > 0) {
          setSelectedSlug(data[0].slug);
        }
      } catch (err) {
        console.error('Failed to fetch journeys:', err);
      } finally {
        setLoadingJourneys(false);
      }
    };
    fetchJourneys();
  }, [get]);

  useEffect(() => {
    if (!selectedSlug) return;

    const fetchGraph = async () => {
      setLoadingGraph(true);
      try {
        const { data } = await get(`/journey-visualizer/graph/${selectedSlug}`);
        setGraphData(data);
      } catch (err) {
        console.error('Failed to fetch graph:', err);
        setGraphData(null);
      } finally {
        setLoadingGraph(false);
      }
    };
    fetchGraph();
  }, [selectedSlug, get]);

  return (
    <Box padding={8} background="neutral100">
      <Flex direction="column" alignItems="stretch" gap={6}>
        <Box>
          <Typography variant="beta" tag="h1">
            Journey Visualizer
          </Typography>
          <Typography variant="epsilon" textColor="neutral600">
            Visualize the screen flow of your onboarding journeys
          </Typography>
        </Box>

        <Box>
          {loadingJourneys ? (
            <Loader>Loading journeys...</Loader>
          ) : (
            <Box>
              <Typography variant="pi" fontWeight="bold" textColor="neutral800" tag="label">
                Select Journey
              </Typography>
              <Box paddingTop={1}>
                <SingleSelect
                  placeholder="Choose a journey to visualize"
                  value={selectedSlug}
                  onChange={(value: string | number) => setSelectedSlug(String(value))}
                >
                  {journeys.map((j) => (
                    <SingleSelectOption key={j.slug} value={j.slug}>
                      {j.name || j.slug}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </Box>
            </Box>
          )}
        </Box>

        <Box
          background="neutral0"
          shadow="tableShadow"
          hasRadius
          padding={4}
          style={{ minHeight: '70vh' }}
        >
          {loadingGraph ? (
            <Flex justifyContent="center" alignItems="center" style={{ height: '60vh' }}>
              <Loader>Loading graph...</Loader>
            </Flex>
          ) : graphData && graphData.nodes.length > 0 ? (
            <>
              <Box paddingBottom={4}>
                <Typography variant="delta">
                  {graphData.journeyName} — {graphData.nodes.length} screens, {graphData.edges.length} transitions
                </Typography>
              </Box>
              <JourneyGraph nodes={graphData.nodes} edges={graphData.edges} />
            </>
          ) : (
            <Flex justifyContent="center" alignItems="center" style={{ height: '60vh' }}>
              <Typography variant="omega" textColor="neutral500">
                {selectedSlug
                  ? 'No graph data found for this journey.'
                  : 'Select a journey to visualize its flow.'}
              </Typography>
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default HomePage;