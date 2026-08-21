import { LocationDetail, RouteCalculation } from '../types/travel';
import { OSRMRoutingProvider } from '../providers/routingProvider';

const provider = new OSRMRoutingProvider();

export class RoutingService {
  static async calculateRoute(origin: LocationDetail, destination: LocationDetail): Promise<RouteCalculation> {
    return provider.getRoute(origin, destination);
  }
}
