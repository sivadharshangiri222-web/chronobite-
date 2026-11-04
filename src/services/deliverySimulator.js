import { base44 } from './base44Engine';

// Simulates intermediate GPS waypoints between restaurant and customer
export function generateRoutePoints(startLat, startLng, endLat, endLng, numSteps = 20) {
  const points = [];
  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps;
    // Add small random slight curve / road jitter for realism
    const jitterLat = Math.sin(t * Math.PI) * 0.0015;
    const jitterLng = Math.cos(t * Math.PI) * 0.0015;
    const lat = startLat + (endLat - startLat) * t + jitterLat;
    const lng = startLng + (endLng - startLng) * t + jitterLng;
    points.push([lat, lng]);
  }
  return points;
}

class GpsSimulatorManager {
  constructor() {
    this.activeSimulations = new Map();
  }

  startSimulation(partnerId, startLat, startLng, endLat, endLng, onTick) {
    this.stopSimulation(partnerId);

    const waypoints = generateRoutePoints(startLat, startLng, endLat, endLng, 25);
    let currentIndex = 0;

    const intervalId = setInterval(async () => {
      if (currentIndex >= waypoints.length) {
        this.stopSimulation(partnerId);
        return;
      }

      const [lat, lng] = waypoints[currentIndex];
      currentIndex++;

      await base44.entities.DeliveryPartner.updateLocation(partnerId, {
        latitude: lat,
        longitude: lng
      });

      if (onTick) {
        onTick({ latitude: lat, longitude: lng, progress: (currentIndex / waypoints.length) * 100 });
      }
    }, 2500); // Step every 2.5 seconds

    this.activeSimulations.set(partnerId, intervalId);
  }

  stopSimulation(partnerId) {
    if (this.activeSimulations.has(partnerId)) {
      clearInterval(this.activeSimulations.get(partnerId));
      this.activeSimulations.delete(partnerId);
    }
  }
}

export const gpsSimulator = new GpsSimulatorManager();
