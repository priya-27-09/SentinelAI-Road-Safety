import { AccidentRecord, BlackSpot, HazardReport, CCTVFeed, RepairWorkOrder, RouteOption } from '../types';

export const INITIAL_BLACK_SPOTS: BlackSpot[] = [
  {
    id: 'bs-01',
    code: 'BS-DL-NH48-01',
    name: 'Mahipalpur Flyover Underpass & Merging Point',
    corridor: 'NH-48 (Delhi - Gurugram Expressway)',
    city: 'New Delhi',
    state: 'Delhi',
    lat: 28.5445,
    lng: 77.1260,
    radiusMeters: 450,
    riskScore: 94,
    riskGrade: 'CRITICAL',
    historicalAccidentsCount: 42,
    fatalities3Yr: 18,
    injuries3Yr: 56,
    morthCriteriaMet: true,
    mlModel: {
      modelType: 'XGBoost_v2.4',
      confidenceScore: 0.96,
      topRiskFactors: [
        { factor: 'Sudden Lane Drop & Weaving', weight: 38, description: '5-lane highway constricts abruptly into 3-lane underpass' },
        { factor: 'Speed Differential', weight: 29, description: 'Heavy commercial trucks entering airport bypass at low speeds against 80km/h traffic' },
        { factor: 'Monsoon Water Stagnation', weight: 19, description: 'Low drainage capacity causes hydroplaning in lane 1 and 2' },
        { factor: 'Poor In-Tunnel Illumination', weight: 14, description: 'Lux level below 35 during dusk transitions' }
      ]
    },
    recommendedInterventions: [
      'Install 6-tier thermoplastic rumble strips 200m before merging junction',
      'Deploy dynamic electronic VMS speed calming signs with active radar',
      'Overhaul drainage pump capacity with automatic stormwater sensors',
      'Upgrade underpass lighting to 120 Lux LED arrays'
    ],
    estimatedCostLakhs: 48.5,
    assignedAuthority: 'NHAI Regional Office, Delhi NCR'
  },
  {
    id: 'bs-02',
    code: 'BS-KA-ORR-04',
    name: 'Silk Board Junction to Marathahalli S-Curve',
    corridor: 'Outer Ring Road (ORR) NH-44',
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9176,
    lng: 77.6238,
    radiusMeters: 500,
    riskScore: 89,
    riskGrade: 'CRITICAL',
    historicalAccidentsCount: 38,
    fatalities3Yr: 14,
    injuries3Yr: 62,
    morthCriteriaMet: true,
    mlModel: {
      modelType: 'RandomForest_Ensemble',
      confidenceScore: 0.93,
      topRiskFactors: [
        { factor: 'Uncontrolled Two-Wheeler Jaywalking', weight: 35, description: 'Pedestrians crossing high-speed corridor near tech parks without skywalk' },
        { factor: 'Deep Edge Potholes & Uneven Bitumen', weight: 28, description: 'Heavy axle loading from inter-state buses damaging shoulder lanes' },
        { factor: 'Blind Angle at Flyover Ramp', weight: 22, description: 'Curvature prevents stopping sight distance (SSD) at night' },
        { factor: 'Erratic U-Turn Maneuvers', weight: 15, description: 'Illegal U-turns through damaged median barriers' }
      ]
    },
    recommendedInterventions: [
      'Construct Grade-Separated Pedestrian Foot Overbridge (FOB) with escalators',
      'High-Friction Anti-Skid Asphalt surfacing on curvature radius',
      'Continuous Reinforced Concrete Median Crash Barrier (Type IRC:119)',
      'Solar-powered LED Blinker studs along road edge'
    ],
    estimatedCostLakhs: 72.0,
    assignedAuthority: 'Bruhat Bengaluru Mahanagara Palike (BBMP) & Traffic Police'
  },
  {
    id: 'bs-03',
    code: 'BS-MH-MPE-08',
    name: 'Khandala Ghat Descent (Amrutanjan Point)',
    corridor: 'Mumbai-Pune Yashwantrao Chavan Expressway',
    city: 'Lonavala / Khandala',
    state: 'Maharashtra',
    lat: 18.7562,
    lng: 73.3768,
    radiusMeters: 600,
    riskScore: 92,
    riskGrade: 'CRITICAL',
    historicalAccidentsCount: 51,
    fatalities3Yr: 23,
    injuries3Yr: 74,
    morthCriteriaMet: true,
    mlModel: {
      modelType: 'XGBoost_v2.4',
      confidenceScore: 0.97,
      topRiskFactors: [
        { factor: 'Steep 7.8% Gradient Brake Failure', weight: 42, description: 'Continuous downhill slope causing brake fade in overloaded multi-axle trucks' },
        { factor: 'Dense Fog & Cloud Inversion', weight: 26, description: 'Visibility drops to under 15 meters during July-October mornings' },
        { factor: 'Sharp Reverse Curve (Radius < 180m)', weight: 20, description: 'Centrifugal rollover hazard for high-center-of-gravity container trailers' },
        { factor: 'Oil / Grease Spillage on Wet Surface', weight: 12, description: 'Frequent engine overheat blowouts depositing slicks' }
      ]
    },
    recommendedInterventions: [
      'Construct emergency escape ramp with deep gravel arrester bed',
      'Mandatory thermal brake temperature scanner at toll plaza entry',
      'High-luminance smart fog fog-lamps with radar guidance',
      'Permanent automated highway speed cameras calibrated to 50 km/h for ghats'
    ],
    estimatedCostLakhs: 115.0,
    assignedAuthority: 'Maharashtra State Road Development Corp (MSRDC)'
  },
  {
    id: 'bs-04',
    code: 'BS-TS-HYD-02',
    name: 'Gachibowli Outer Ring Road (ORR) Exit 19',
    corridor: 'Nehru ORR / IT Corridor Interchange',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.4399,
    lng: 78.3489,
    radiusMeters: 400,
    riskScore: 78,
    riskGrade: 'HIGH',
    historicalAccidentsCount: 26,
    fatalities3Yr: 9,
    injuries3Yr: 34,
    morthCriteriaMet: true,
    mlModel: {
      modelType: 'XGBoost_v2.4',
      confidenceScore: 0.89,
      topRiskFactors: [
        { factor: 'Excessive Night Speeding (>120 km/h)', weight: 44, description: 'Straight open stretch encouraging speed limit violations' },
        { factor: 'Last-Second Exit Cut-Ins', weight: 27, description: 'Vehicles from rightmost lane cutting across 4 lanes to take exit slip' },
        { factor: 'Lack of Attenuation Cushions', weight: 18, description: 'Concrete gore point lacks crash attenuator protection' },
        { factor: 'Light Glare from Opposite Carriageway', weight: 11, description: 'Inadequate anti-glare screens in median plantation' }
      ]
    },
    recommendedInterventions: [
      'Install QuadGuard Crash Attenuator at exit nose gore',
      'Add 1.5m High-Density Polyethylene anti-glare screens on median',
      'Automatic Number Plate Recognition (ANPR) speed tracking cameras',
      'Enhanced chevron directional guide signs with LED blinking borders'
    ],
    estimatedCostLakhs: 34.0,
    assignedAuthority: 'Hyderabad Metropolitan Development Authority (HMDA)'
  },
  {
    id: 'bs-05',
    code: 'BS-TN-CHE-07',
    name: 'Kathipara Grade Separator & Guindy Industrial Estate Junction',
    corridor: 'Grand Southern Trunk (GST) Road / NH-32',
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0067,
    lng: 80.2033,
    radiusMeters: 550,
    riskScore: 81,
    riskGrade: 'HIGH',
    historicalAccidentsCount: 31,
    fatalities3Yr: 11,
    injuries3Yr: 48,
    morthCriteriaMet: true,
    mlModel: {
      modelType: 'RandomForest_Ensemble',
      confidenceScore: 0.91,
      topRiskFactors: [
        { factor: 'Complex 4-Tier Cloverleaf Weaving', weight: 36, description: 'Confusing lane directions leading to sudden braking' },
        { factor: 'Two-Wheeler Skidding on Expansion Joints', weight: 29, description: 'Uncoated metal expansion joints become slippery when wet' },
        { factor: 'Auto-Rickshaw Cluster Stoppages', weight: 21, description: 'Informal passenger pickup blocking flyover entry slip' },
        { factor: 'Night Lighting Shadow Zones', weight: 14, description: 'Pillar shadows masking stalled vehicles' }
      ]
    },
    recommendedInterventions: [
      'Epoxy-resin anti-skid coating on all flyover expansion joints',
      'Designated segregated IPT (auto/bus) pickup bays with bollards',
      'Reflective solar cat-eyes and flexible lane guide delineators',
      'Continuous CCTV surveillance with AI stalled-vehicle detection'
    ],
    estimatedCostLakhs: 29.5,
    assignedAuthority: 'Highways & Minor Ports Department, Tamil Nadu'
  },
  {
    id: 'bs-06',
    code: 'BS-UP-YEW-03',
    name: 'Yamuna Expressway Milepost 68 (Mathura Section)',
    corridor: 'Yamuna Expressway (Greater Noida - Agra)',
    city: 'Mathura',
    state: 'Uttar Pradesh',
    lat: 27.6521,
    lng: 77.6890,
    radiusMeters: 700,
    riskScore: 88,
    riskGrade: 'CRITICAL',
    historicalAccidentsCount: 45,
    fatalities3Yr: 21,
    injuries3Yr: 69,
    morthCriteriaMet: true,
    mlModel: {
      modelType: 'XGBoost_v2.4',
      confidenceScore: 0.95,
      topRiskFactors: [
        { factor: 'Zero-Visibility Winter Dense Fog (Smog)', weight: 46, description: 'Paddy burning and winter inversion reduce visibility < 10m' },
        { factor: 'Highway Hypnosis & Driver Fatigue', weight: 28, description: 'Monotonous straight concrete alignment causes micro-sleep at 3-5 AM' },
        { factor: 'Tyre Burst Due to Concrete Heat Buildup', weight: 16, description: 'High surface friction on rigid pavement in summer overheating worn tyres' },
        { factor: 'Chain-reaction Pileup Risk', weight: 10, description: 'Tailgating without 4-second following distance' }
      ]
    },
    recommendedInterventions: [
      'Continuous Transverse Rumble Strips every 5km to combat hypnosis',
      'Dynamic Variable Speed Limit (VSL) integrated with optical fog sensors',
      'Rest-stop biometric fatigue testing booths and nitrogen air stations',
      'Side crash barriers upgrade to W-beam with high-retroreflectivity'
    ],
    estimatedCostLakhs: 85.0,
    assignedAuthority: 'Yamuna Expressway Industrial Development Authority (YEIDA)'
  }
];

export const INITIAL_ACCIDENTS: AccidentRecord[] = [
  {
    id: 'acc-01',
    title: 'Multi-Vehicle Fog Pileup on Yamuna Expressway',
    locationName: 'Milepost 68, near Raya Toll Plaza',
    city: 'Mathura',
    state: 'Uttar Pradesh',
    highwayCode: 'Yamuna Expressway',
    lat: 27.6525,
    lng: 77.6895,
    severity: 'FATAL',
    fatalities: 4,
    injuries: 12,
    date: '2026-02-14',
    timeOfDay: 'MIDNIGHT_DAWN',
    weather: 'DENSE_FOG',
    roadCategory: 'EXPRESSWAY',
    primaryCause: 'POOR_VISIBILITY',
    vehiclesInvolved: ['SUV', 'Private Bus', '2 Hatchbacks', 'Container Truck'],
    description: 'Dense morning winter fog reduced visibility to under 8 meters; lead truck slowed down and following vehicles collided in rapid succession.'
  },
  {
    id: 'acc-02',
    title: 'Container Truck Rollover on Khandala Ghat Sharp Curve',
    locationName: 'Near Amrutanjan Bridge Hairpin Bend',
    city: 'Khandala',
    state: 'Maharashtra',
    highwayCode: 'Mumbai-Pune Expressway',
    lat: 18.7568,
    lng: 73.3762,
    severity: 'FATAL',
    fatalities: 2,
    injuries: 5,
    date: '2026-04-03',
    timeOfDay: 'NIGHT',
    weather: 'HEAVY_RAIN',
    roadCategory: 'EXPRESSWAY',
    primaryCause: 'SHARP_CURVATURE',
    vehiclesInvolved: ['Heavy Multi-Axle Container', 'Sedan'],
    description: 'Overheated brakes failed on steep downhill gradient during monsoon shower; trailer skidded across median into oncoming lane.'
  },
  {
    id: 'acc-03',
    title: 'Motorcycle Skidded over Deep Monsoon Pothole',
    locationName: 'Outer Ring Road, Bellandur Flyover Ascent',
    city: 'Bengaluru',
    state: 'Karnataka',
    highwayCode: 'NH-44',
    lat: 12.9298,
    lng: 77.6745,
    severity: 'GREVIOUS',
    fatalities: 1,
    injuries: 1,
    date: '2026-05-18',
    timeOfDay: 'EVENING_PEAK',
    weather: 'HEAVY_RAIN',
    roadCategory: 'URBAN_ARTERIAL',
    primaryCause: 'POTHOLE_SURFACE_DEFECT',
    vehiclesInvolved: ['Two-Wheeler', 'BMTC City Bus'],
    description: 'Two-wheeler lost control hitting submerged water-filled pothole on outer lane; rider fell and was struck by rear tyre of bus.'
  },
  {
    id: 'acc-04',
    title: 'Head-on Collision from Wrong-Side Tractor Entry',
    locationName: 'NH-48 Bilaspur Chowk Service Lane Merge',
    city: 'Gurugram',
    state: 'Haryana',
    highwayCode: 'NH-48',
    lat: 28.3245,
    lng: 76.9180,
    severity: 'FATAL',
    fatalities: 3,
    injuries: 4,
    date: '2026-06-08',
    timeOfDay: 'NIGHT',
    weather: 'CLEAR',
    roadCategory: 'NATIONAL_HIGHWAY',
    primaryCause: 'WRONG_SIDE_DRIVING',
    vehiclesInvolved: ['Agricultural Tractor Trolley', 'Commercial SUV'],
    description: 'Unlit tractor carrying iron rods drove on wrong side of expressway to bypass 2km toll detour, causing high-speed impact.'
  },
  {
    id: 'acc-05',
    title: 'Over-speeding Luxury Sedan hit Divider at Airport Link',
    locationName: 'Mahipalpur Junction Underpass entry',
    city: 'New Delhi',
    state: 'Delhi',
    highwayCode: 'NH-48',
    lat: 28.5442,
    lng: 77.1265,
    severity: 'GREVIOUS',
    fatalities: 1,
    injuries: 3,
    date: '2026-07-22',
    timeOfDay: 'MIDNIGHT_DAWN',
    weather: 'CLEAR',
    roadCategory: 'NATIONAL_HIGHWAY',
    primaryCause: 'OVERSPEEDING',
    vehiclesInvolved: ['Sedan'],
    description: 'Vehicle traveling at 130 km/h clipped concrete divider nose while attempting abrupt exit into airport bypass road.'
  },
  {
    id: 'acc-06',
    title: 'Stray Cattle Hazard causing Two-Wheeler Pileup',
    locationName: 'GST Road near Tambaram Sanatorium',
    city: 'Chennai',
    state: 'Tamil Nadu',
    highwayCode: 'NH-32',
    lat: 12.9388,
    lng: 80.1345,
    severity: 'MINOR',
    fatalities: 0,
    injuries: 3,
    date: '2026-08-01',
    timeOfDay: 'NIGHT',
    weather: 'CLEAR',
    roadCategory: 'URBAN_ARTERIAL',
    primaryCause: 'PEDESTRIAN_JAYWALK',
    vehiclesInvolved: ['2 Two-Wheelers', 'Auto Rickshaw'],
    description: 'Unlit herd of cattle stepped into fast lane from damaged median plantation; vehicles braked sharply and collided.'
  }
];

export const INITIAL_HAZARDS: HazardReport[] = [
  {
    id: 'hz-01',
    title: 'Deep 1.2m Pothole with Exposed Rebar',
    type: 'POTHOLE',
    description: 'Severe road crater on right lane right after Mahipalpur flyover towards Gurugram. Multiple cars damaged rims in past 2 hours.',
    lat: 28.5439,
    lng: 77.1251,
    address: 'NH-48 Kms 14.2, Mahipalpur Bypass, New Delhi',
    city: 'New Delhi',
    timestamp: '15 mins ago',
    reportedBy: 'Vikram S. (Driver)',
    reporterType: 'VOICE_ASSIST',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
    upvotes: 42,
    verifiedByAi: true,
    aiVerificationDetails: {
      confidence: 0.98,
      detectedObjects: ['Damaged Bitumen', 'Edge Fracture', 'Vehicle Avoidance Swerve'],
      urgencyLevel: 'IMMEDIATE'
    },
    status: 'WORK_ORDER_ISSUED'
  },
  {
    id: 'hz-02',
    title: 'Severe Stormwater Waterlogging (1.5 ft deep)',
    type: 'WATERLOGGING',
    description: 'Silk Board junction underpass flooded following 45 mins cloudburst. Two-wheelers stalling, traffic backlog extending 4 kms.',
    lat: 12.9174,
    lng: 77.6231,
    address: 'Central Silk Board Flyover Underpass, Bengaluru',
    city: 'Bengaluru',
    timestamp: '32 mins ago',
    reportedBy: 'Ananya R. (Commuter)',
    reporterType: 'CAMERA_AI',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    upvotes: 87,
    verifiedByAi: true,
    aiVerificationDetails: {
      confidence: 0.94,
      detectedObjects: ['Submerged Surface', 'Hydroplaning Risk', 'Stalled Vehicle'],
      urgencyLevel: 'IMMEDIATE'
    },
    status: 'IN_PROGRESS'
  },
  {
    id: 'hz-03',
    title: 'Diesel Fuel Spill across 300m Curved Gradient',
    type: 'OIL_SPILL',
    description: 'Truck fuel tank ruptured on Khandala downhill curve. Surface extremely slick, two cars already spun 180 degrees.',
    lat: 18.7559,
    lng: 73.3760,
    address: 'Mumbai-Pune Expressway, Km 42.6, Khandala Ghat',
    city: 'Khandala',
    timestamp: '8 mins ago',
    reportedBy: 'Highway Patrol Team #4',
    reporterType: 'IOT_SENSOR',
    imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
    upvotes: 19,
    verifiedByAi: true,
    aiVerificationDetails: {
      confidence: 0.99,
      detectedObjects: ['Hydrocarbon Slick', 'Zero-Friction Zone', 'Grip Loss Hazard'],
      urgencyLevel: 'IMMEDIATE'
    },
    status: 'IN_PROGRESS'
  },
  {
    id: 'hz-04',
    title: 'Commercial Truck Driving on Wrong Side against 80km/h traffic',
    type: 'WRONG_SIDE',
    description: 'Heavy water tanker driving against one-way flow on Gachibowli ORR service ramp to enter construction site.',
    lat: 17.4391,
    lng: 78.3495,
    address: 'Gachibowli ORR Exit 19, Financial District, Hyderabad',
    city: 'Hyderabad',
    timestamp: '2 mins ago',
    reportedBy: 'Rohit M. (Cab Driver)',
    reporterType: 'VOICE_ASSIST',
    imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=600&q=80',
    upvotes: 64,
    verifiedByAi: true,
    aiVerificationDetails: {
      confidence: 0.96,
      detectedObjects: ['Wrong-way Direction Vector', 'High Impact Velocity Risk'],
      urgencyLevel: 'IMMEDIATE'
    },
    status: 'PENDING_REVIEW'
  },
  {
    id: 'hz-05',
    title: 'Fallen Concrete Median Barrier leaving 20m Gap',
    type: 'BROKEN_DIVIDER',
    description: 'Damaged jersey barrier allowing illegal U-turns directly across high speed lane.',
    lat: 13.0071,
    lng: 80.2028,
    address: 'GST Road near Kathipara Flyover descending ramp, Chennai',
    city: 'Chennai',
    timestamp: '1 hour ago',
    reportedBy: 'Citizen Reporter App',
    reporterType: 'QUICK_TAP',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    upvotes: 31,
    verifiedByAi: true,
    aiVerificationDetails: {
      confidence: 0.91,
      detectedObjects: ['Compromised Barrier', 'Crossing Threat'],
      urgencyLevel: 'HIGH'
    },
    status: 'WORK_ORDER_ISSUED'
  }
];

export const INITIAL_CCTV_FEEDS: CCTVFeed[] = [
  {
    id: 'cam-01',
    cameraName: 'CCTV-NH48-DELHI-04',
    junction: 'Mahipalpur Underpass Northern Portal',
    city: 'New Delhi',
    lat: 28.5445,
    lng: 77.1260,
    status: 'WARNING',
    streamUrl: 'https://live-traffic.delhipolice.gov.in/feed/nh48-mp4',
    imageUrl: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    currentRiskIndex: 87,
    vehicleCountPerMin: 142,
    avgSpeedKmph: 68,
    activeDetections: [
      {
        type: 'POTHOLE',
        confidence: 0.94,
        box: { x: 38, y: 62, width: 18, height: 12 },
        description: 'Large surface cavity detected in Lane 2',
        timestamp: 'Live'
      },
      {
        type: 'SPEED_VIOLATION',
        confidence: 0.88,
        box: { x: 65, y: 40, width: 22, height: 28 },
        description: 'Sedan clocked at 104 km/h (Limit: 70 km/h)',
        timestamp: '12s ago'
      }
    ]
  },
  {
    id: 'cam-02',
    cameraName: 'CCTV-MPE-GHAT-09',
    junction: 'Khandala Amrutanjan Hairpin Curve',
    city: 'Khandala',
    lat: 18.7562,
    lng: 73.3768,
    status: 'WARNING',
    streamUrl: 'https://msrdc.gov.in/cctv/expressway-khandala',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    currentRiskIndex: 91,
    vehicleCountPerMin: 88,
    avgSpeedKmph: 42,
    activeDetections: [
      {
        type: 'WATERLOGGING',
        confidence: 0.96,
        box: { x: 15, y: 70, width: 45, height: 20 },
        description: 'Monsoon runoff causing water stagnation on downhill bank',
        timestamp: 'Live'
      },
      {
        type: 'STALLED_VEHICLE',
        confidence: 0.92,
        box: { x: 72, y: 55, width: 24, height: 32 },
        description: 'Multi-axle truck stopped with hazard blinkers on shoulder',
        timestamp: '4m ago'
      }
    ]
  },
  {
    id: 'cam-03',
    cameraName: 'CCTV-BLR-ORR-12',
    junction: 'Silk Board Outer Ring Road Flyover Ascent',
    city: 'Bengaluru',
    lat: 12.9176,
    lng: 77.6238,
    status: 'ONLINE',
    streamUrl: 'https://btp.gov.in/live/silk-board-cam12',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    currentRiskIndex: 76,
    vehicleCountPerMin: 185,
    avgSpeedKmph: 22,
    activeDetections: [
      {
        type: 'PEDESTRIAN_HAZARD',
        confidence: 0.91,
        box: { x: 48, y: 45, width: 12, height: 26 },
        description: 'Pedestrian running across 6-lane carriageway',
        timestamp: 'Live'
      }
    ]
  },
  {
    id: 'cam-04',
    cameraName: 'CCTV-HYD-ORR-07',
    junction: 'Gachibowli Interchange Exit 19',
    city: 'Hyderabad',
    lat: 17.4399,
    lng: 78.3489,
    status: 'ONLINE',
    streamUrl: 'https://hmda.gov.in/orr/gachibowli-cam',
    imageUrl: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    currentRiskIndex: 58,
    vehicleCountPerMin: 120,
    avgSpeedKmph: 85,
    activeDetections: [
      {
        type: 'WRONG_SIDE',
        confidence: 0.89,
        box: { x: 10, y: 50, width: 20, height: 25 },
        description: 'Two-wheeler riding against flow on exit ramp',
        timestamp: '1m ago'
      }
    ]
  }
];

export const INITIAL_REPAIR_ORDERS: RepairWorkOrder[] = [
  {
    id: 'wo-101',
    workOrderNumber: 'NHAI/NCR/2026/WO-4881',
    title: 'Emergency Cold-Mix Pothole Resurfacing & Rumble Strips',
    blackSpotId: 'bs-01',
    hazardId: 'hz-01',
    locationName: 'NH-48 Mahipalpur Underpass Corridor',
    authority: 'NHAI Regional Office Delhi',
    contractor: 'Larsen & Toubro Infrastructure InfraCare',
    priorityScore: 96,
    estimatedCostInrLakhs: 4.8,
    targetCompletionDays: 2,
    daysRemaining: 1,
    status: 'IN_PROGRESS',
    interventionType: 'ASPHALT_RESURFACING',
    aiRecommendedNotes: 'Critical accident hotspot. High axle load caused shear deformation. Recommended 50mm Bituminous Concrete (BC) with polymodified binder.'
  },
  {
    id: 'wo-102',
    workOrderNumber: 'BBMP/R&B/2026/WO-902',
    title: 'High-Friction Anti-Skid Surfacing & Drainage Rectification',
    blackSpotId: 'bs-02',
    hazardId: 'hz-02',
    locationName: 'Silk Board Junction to Marathahalli S-Curve',
    authority: 'BBMP Engineering Division, Bengaluru',
    contractor: 'NCC Urban Infrastructure Ltd',
    priorityScore: 92,
    estimatedCostInrLakhs: 18.5,
    targetCompletionDays: 7,
    daysRemaining: 4,
    status: 'WORK_ORDER_ISSUED',
    interventionType: 'DRAINAGE_OVERHAUL',
    aiRecommendedNotes: 'Hydroplaning risk index exceeds 0.85 during rains. Install heavy-duty cast iron slotted grating with automated sump evacuation.'
  },
  {
    id: 'wo-103',
    workOrderNumber: 'MSRDC/MPE/2026/WO-3301',
    title: 'Emergency Arrester Bed & Heavy Duty Crash Cushion',
    blackSpotId: 'bs-03',
    hazardId: 'hz-03',
    locationName: 'Khandala Ghat Descent (Amrutanjan Point)',
    authority: 'Maharashtra State Road Development Corp',
    contractor: 'IRB Infrastructure Developers',
    priorityScore: 95,
    estimatedCostInrLakhs: 42.0,
    targetCompletionDays: 14,
    daysRemaining: 9,
    status: 'IN_PROGRESS',
    interventionType: 'MEDIAN_CRASH_BARRIER',
    aiRecommendedNotes: 'Heavy truck brake failure corridor. Install 80m loose pea-gravel runaway truck ramp with 15-ton deceleration capability.'
  },
  {
    id: 'wo-104',
    workOrderNumber: 'TN-HW/CHE/2026/WO-112',
    title: 'Anti-Glare Median Screens & LED Delineator Replacement',
    blackSpotId: 'bs-05',
    hazardId: 'hz-05',
    locationName: 'Kathipara Cloverleaf GST Road Junction',
    authority: 'Tamil Nadu Highways Department',
    contractor: 'GMR Highways Maintenance',
    priorityScore: 79,
    estimatedCostInrLakhs: 7.2,
    targetCompletionDays: 5,
    daysRemaining: 3,
    status: 'PENDING_REVIEW',
    interventionType: 'RUMBLE_STRIPS_SIGNAGE',
    aiRecommendedNotes: 'Night glare reduces driver perception distance by 60%. Install continuous IRC:SP:84 compliant polycarbonate anti-glare blades.'
  }
];

export const SAMPLE_ROUTES: RouteOption[] = [
  {
    id: 'route-fast',
    name: 'NH-48 Direct Expressway Route (Fastest)',
    distanceKm: 34.2,
    durationMins: 42,
    safetyScore: 48,
    accidentDensityScore: 86,
    blackSpotsEnRoute: 3,
    activeHazardsEnRoute: 2,
    weatherRisk: 'HIGH',
    isAiRecommended: false,
    warnings: [
      'Passes directly through Mahipalpur Critical Black Spot #1',
      'Active report: Deep 1.2m pothole on right lane at Km 14.2',
      'Monsoon waterlogging reported near IGI terminal underpass'
    ],
    waypoints: [
      [28.6139, 77.2090],
      [28.5820, 77.1650],
      [28.5445, 77.1260],
      [28.4900, 77.0850],
      [28.4595, 77.0266]
    ]
  },
  {
    id: 'route-safe',
    name: 'AI-Recommended Safe Corridor (Vasant Kunj - MG Road Bypass)',
    distanceKm: 36.8,
    durationMins: 47,
    safetyScore: 92,
    accidentDensityScore: 18,
    blackSpotsEnRoute: 0,
    activeHazardsEnRoute: 0,
    weatherRisk: 'LOW',
    isAiRecommended: true,
    warnings: [
      'Adds 5 mins travel time, but reduces accident probability by 74%',
      '100% well-illuminated corridor with median concrete barriers and no unpaved shoulders'
    ],
    waypoints: [
      [28.6139, 77.2090],
      [28.5650, 77.1900],
      [28.5200, 77.1550],
      [28.4800, 77.1000],
      [28.4595, 77.0266]
    ]
  }
];
