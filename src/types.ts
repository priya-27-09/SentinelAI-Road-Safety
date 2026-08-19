export type SeverityLevel = 'FATAL' | 'GREVIOUS' | 'MINOR' | 'POTENTIAL_RISK';
export type RiskGrade = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
export type HazardType = 'POTHOLE' | 'WATERLOGGING' | 'OIL_SPILL' | 'ACCIDENT' | 'WRONG_SIDE' | 'STRAY_ANIMALS' | 'BROKEN_DIVIDER' | 'POOR_LIGHTING' | 'BLIND_SPOT';
export type RoadCategory = 'NATIONAL_HIGHWAY' | 'EXPRESSWAY' | 'STATE_HIGHWAY' | 'URBAN_ARTERIAL' | 'RURAL_ROAD';
export type RepairStatus = 'PENDING_REVIEW' | 'WORK_ORDER_ISSUED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFIED';

export interface AccidentRecord {
  id: string;
  title: string;
  locationName: string;
  city: string;
  state: string;
  highwayCode?: string;
  lat: number;
  lng: number;
  severity: SeverityLevel;
  fatalities: number;
  injuries: number;
  date: string;
  timeOfDay: 'MORNING_PEAK' | 'AFTERNOON' | 'EVENING_PEAK' | 'NIGHT' | 'MIDNIGHT_DAWN';
  weather: 'CLEAR' | 'HEAVY_RAIN' | 'DENSE_FOG' | 'MIST' | 'HIGH_WIND';
  roadCategory: RoadCategory;
  primaryCause: 'OVERSPEEDING' | 'POTHOLE_SURFACE_DEFECT' | 'WRONG_SIDE_DRIVING' | 'POOR_VISIBILITY' | 'SHARP_CURVATURE' | 'PEDESTRIAN_JAYWALK' | 'DRUNK_DRIVING';
  vehiclesInvolved: string[];
  description: string;
}

export interface FeatureWeights {
  trafficDensity: number; // 0 - 100
  roadCurvature: number; // 0 - 100
  lightingDeficiency: number; // 0 - 100
  surfaceDefectScore: number; // 0 - 100
  weatherSensitivity: number; // 0 - 100
  speedVariance: number; // 0 - 100
  historicalFatalityWeight: number; // 0 - 100
}

export interface BlackSpot {
  id: string;
  code: string;
  name: string;
  corridor: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  riskScore: number; // 0 - 100
  riskGrade: RiskGrade;
  historicalAccidentsCount: number;
  fatalities3Yr: number;
  injuries3Yr: number;
  morthCriteriaMet: boolean;
  mlModel: {
    modelType: 'XGBoost_v2.4' | 'RandomForest_Ensemble';
    confidenceScore: number;
    topRiskFactors: { factor: string; weight: number; description: string }[];
  };
  recommendedInterventions: string[];
  estimatedCostLakhs: number;
  assignedAuthority: string; // e.g. "NHAI Regional Office Delhi" | "BBMP PWD" | "Maharashtra MSRDC"
}

export interface HazardReport {
  id: string;
  title: string;
  type: HazardType;
  description: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  timestamp: string;
  reportedBy: string;
  reporterType: 'VOICE_ASSIST' | 'QUICK_TAP' | 'CAMERA_AI' | 'IOT_SENSOR';
  imageUrl?: string;
  upvotes: number;
  verifiedByAi: boolean;
  aiVerificationDetails?: {
    confidence: number;
    detectedObjects: string[];
    urgencyLevel: 'IMMEDIATE' | 'HIGH' | 'STANDARD';
  };
  status: RepairStatus;
}

export interface CCTVFeed {
  id: string;
  cameraName: string;
  junction: string;
  city: string;
  lat: number;
  lng: number;
  status: 'ONLINE' | 'WARNING' | 'MAINTENANCE';
  streamUrl: string;
  imageUrl: string;
  currentRiskIndex: number;
  activeDetections: {
    type: 'POTHOLE' | 'WRONG_SIDE' | 'SPEED_VIOLATION' | 'WATERLOGGING' | 'PEDESTRIAN_HAZARD' | 'STALLED_VEHICLE';
    confidence: number;
    box: { x: number; y: number; width: number; height: number }; // percentage coords
    description: string;
    timestamp: string;
  }[];
  vehicleCountPerMin: number;
  avgSpeedKmph: number;
}

export interface RepairWorkOrder {
  id: string;
  workOrderNumber: string;
  title: string;
  blackSpotId?: string;
  hazardId?: string;
  locationName: string;
  authority: string;
  contractor: string;
  priorityScore: number; // 0 - 100 based on Safety × Traffic / Cost
  estimatedCostInrLakhs: number;
  targetCompletionDays: number;
  daysRemaining: number;
  status: RepairStatus;
  interventionType: 'ASPHALT_RESURFACING' | 'RUMBLE_STRIPS_SIGNAGE' | 'HIGH_MAST_LIGHTING' | 'MEDIAN_CRASH_BARRIER' | 'PEDESTRIAN_SKYWALK' | 'DRAINAGE_OVERHAUL';
  aiRecommendedNotes: string;
}

export interface RouteOption {
  id: string;
  name: string;
  distanceKm: number;
  durationMins: number;
  safetyScore: number; // 0 - 100 (higher is safer)
  accidentDensityScore: number; // 0 - 100 (lower is safer)
  blackSpotsEnRoute: number;
  activeHazardsEnRoute: number;
  weatherRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  isAiRecommended: boolean;
  warnings: string[];
  waypoints: [number, number][];
}
