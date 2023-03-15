import AMapLoader from '@amap/amap-jsapi-loader'

// @ts-ignore
window._AMapSecurityConfig = {
  securityJsCode: '2763010d0eff924ecedd30d04b207c9d',
}

export interface Address {
  coords: GeolocationCoordinates
  formattedAddress: string
  addressComponent: {
    province: string
    city: string
    district: string
    township: string
    street: string
    streetNumber: string
    adcode: string
  }
  pois: Array<{
    id: string
    name: string
    type: string
    address: string
    distance: string
  }>
}

export interface Weather {
  weather: string
  temperature: string
  windDirection: string
  windPower: string
  humidity: string
}

class AmapSDK {
  public isReady: Promise<boolean>
  private amap: any
  private geo: any
  private weather: any

  constructor() {
    this.isReady = this.init()
  }

  async init() {
    this.amap = await AMapLoader.load({
      key: '3b40ac033dcbae5cf515672edff5d8be',
      version: '2.0',
      plugins: ['AMap.Geocoder', 'AMap.Weather'],
    })
    this.geo = new this.amap.Geocoder({
      extensions: 'all',
    })
    this.weather = new this.amap.Weather()
    return true
  }

  getLocation(): Promise<Address> {
    return new Promise(async (resolve, reject) => {
      const callback = (status: string, result: any) => {
        if (status === 'complete') {
          const location = result.regeocode as Address
          location.coords = coords
          location.pois.sort((a, b) => {
            return parseInt(a.distance) - parseInt(b.distance)
          })
          resolve(location)
        } else {
          reject('get location failed, status: ' + status)
        }
      }
      const coords = (await gpsLocate()).coords
      this.geo.getAddress(await this.convertCoords(coords), callback)
    })
  }

  convertCoords(coords: GeolocationCoordinates): Promise<any> {
    return new Promise((resolve, reject) => {
      this.amap.convertFrom(
        [coords.longitude, coords.latitude],
        'gps',
        (status: string, result: any) => {
          if (status === 'complete') {
            resolve(result.locations[0])
          } else {
            reject('convert coords failed, status: ' + status)
          }
        }
      )
    })
  }

  getWeather(adcode: string): Promise<Weather> {
    return new Promise((resolve, reject) => {
      this.weather.getLive(adcode, (err: any, data: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(data as Weather)
        }
      })
    })
  }
}

function gpsLocate(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position)
      },
      (error) => {
        reject(error)
      }
    )
  })
}

export const Amap = new AmapSDK()
