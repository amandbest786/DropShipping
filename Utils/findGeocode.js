class findGeocode {
    constructor(productAddress, supplierAddress) {
      this.productAddress = productAddress;
      this.supplierAddress = supplierAddress;
    }
  
    async findGeocode(address, type) {
      if (type == "product") {
        return { address: address, coordinates: [87.30455367609972, 22.350889397956877] };
      } else if (type == "sheller") {
        return { address: address, coordinates: [87.06888144913029, 23.236245212459167] };
      }
    }
  
    async calculateDistanceBetweenTwoPoints(productAddress, supplierAddress) {
      console.log("calculateDistanceBetweenTwoPoints......", productAddress, supplierAddress);
      const getProdutsAddress = await this.findGeocode(productAddress, "product");
      const getSupplierAddress = await this.findGeocode(supplierAddress, "sheller");
      console.log("getProduct....>>>>><<<<<", getProdutsAddress);
      console.log("get supplier......>>><<<<<", getSupplierAddress);
      const getDistanceResponse = await this.findDistance(getProdutsAddress, getSupplierAddress);
      console.log("getDistanceResponse.....>><><><>>", getDistanceResponse);
      return getDistanceResponse;
    }
  
    async findDistance(productCoordinates, supplierCoordinates) {
      console.log("produtc...>>>>>", productCoordinates);
      console.log("supplier....>>>>>", supplierCoordinates);
      const getLatProduct = productCoordinates.coordinates[0];
      const getLonProduct = productCoordinates.coordinates[1];
  
      const getLatSupplier = supplierCoordinates.coordinates[0];
      const getLonSupplier = supplierCoordinates.coordinates[1];
  
      const getDistance = await this.haversineDistance(getLatProduct, getLonProduct, getLatSupplier, getLonSupplier);
      console.log("getDistance haversinbe.....",getDistance);
      const getPreciseDistance = await this.foundPresesion(getDistance,5);
      return getPreciseDistance;
    }
  
    async haversineDistance(lat1, lon1, lat2, lon2) {
      const toRadians = (degrees) => (degrees * Math.PI) / 180;
  
      const R = 6371; 
      const φ1 = toRadians(lat1);
      const φ2 = toRadians(lat2);
      const Δφ = toRadians(lat2 - lat1);
      const Δλ = toRadians(lon2 - lon1);
  
      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
      const distance = R * c;
      return distance;
    }

    async foundPresesion(distance,precision){
        const factor = Math.pow(10, precision);
        return Math.round(distance * factor) / factor;
    }
  }
  
  module.exports = new findGeocode();
  