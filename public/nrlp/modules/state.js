const state = {
  allNodes: [],
  allLinks: [],
  hiddenIds: new Set(),
  highlightNodes: new Set(),
  highlightLinks: new Set(),
  focusedIds: null,
  selectedNodeId: null,
  graphInstance: null,
  currentDatasetPath: '/nrlp_3j.json',
  centerMode: 'thema',
  viewMode: 'graph',
  activePreset: 'voll',
  densityMode: 'high',
  neighborhoodDepth: 1,
  pinnedHighlightIds: new Set(),
  hasUserTranslatedGraph: false,
  currentNrlp: null,
  zirkLehrjahrFilter: 'all',
  zirkMinRFilter: 1,
  zirkViewMode: 'heatmap',
  nodeDegreeMap: new Map(),
  maxNodeDegree: 1,
  dom: {
    datasetSelect: null,
    viewSelect: null,
    presetSelect: null,
    zirkLehrjahrSelect: null,
    zirkMinRSelect: null
  }
};

export function getState() {
  return state;
}

export function setState(patch) {
  Object.assign(state, patch || {});
  return state;
}

export function resetStateForDataset() {
  state.allNodes = [];
  state.allLinks = [];
  state.hasUserTranslatedGraph = false;
  state.focusedIds = null;
  state.selectedNodeId = null;
  state.hiddenIds.clear();
  state.highlightNodes.clear();
  state.highlightLinks.clear();
  state.pinnedHighlightIds.clear();
  state.nodeDegreeMap = new Map();
  state.maxNodeDegree = 1;
}

