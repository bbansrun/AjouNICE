<template>
  <div class="wrapper">
    <Navigation :scroll-base="scrollBase" />
    <Landing
      ref="scrollBase"
      title="Ajou버스"
      description="학교 주변에서 이용할 수 있는 교통수단을 알려드립니다."
      background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg"
    />
    <main>
      <div class="wrapper container">
        <section class="shuttle">
          <header class="underline underline-inline-block">
            <strong>학교 셔틀버스</strong>
          </header>
          <b-tabs v-model="activeTabs">
            <b-tab-item label="학기">
              <b-collapse
                v-for="item in busRoutes"
                :key="item.label"
                class="card"
                animation="slide"
              >
                <div
                  slot="trigger"
                  slot-scope="props"
                  class="card-header"
                  role="button"
                >
                  <p class="card-header-title">
                    {{ item.label }}
                  </p>
                  <a class="card-header-icon">
                    <b-icon
                      :icon="props.open ? 'menu-down' : 'menu-up'"
                    />
                  </a>
                </div>
                <div class="card-content">
                  <div class="content">
                    <b-table
                      :data="item.data"
                      :columns="item.columns"
                    />
                  </div>
                </div>
              </b-collapse>
            </b-tab-item>
          </b-tabs>
        </section>
        <hr>
        <section class="ord-bus">
          <header class="underline underline-inline-block">
            <strong>마을버스</strong>
          </header>
          <b-message
            title="비고"
          >
            광교중앙역 출발 기준 시간입니다. 도서관까지 약 10분 소요됩니다.
          </b-message>
          <b-taglist>
            <b-tag
              v-for="item in schoolBus.data.townShuttle"
              :key="item.route"
              type="is-warning"
            >
              <strong>{{ item.route }}</strong>
            </b-tag>
          </b-taglist>
          <header class="underline underline-inline-block">
            <strong>일반 시내/광역버스</strong>
          </header>
          <div class="buses">
            <model-select
              v-model="item"
              :options="options"
              placeholder="목적지를 선택하시면 해당 방향 버스노선이 정렬됩니다."
            />
            <div class="grid">
              <div
                v-for="type in buses.types"
                :key="type.type"
                class="routes"
              >
                <h6>{{ type.label }}</h6>
                <span v-if="item.value && buses.routes.filter(elem => (elem.type === type.type && elem.bound.includes(item.value))).length === 0">
                  <small>없음</small>
                </span>
                <b-tag
                  v-for="route in buses.routes.filter(elem => elem.type === type.type)"
                  v-show="item.value === '' || (item.value && route.bound.includes(item.value))"
                  :key="route.num"
                  :type="{ 'is-success': route.type === 1, 'is-warning': route.type === 2, 'is-danger': route.type === 3, 'is-info': route.type === 4 }"
                >
                  <span>{{ route.num }}</span>
                  <span v-show="route.etc">({{ route.etc }})</span>
                </b-tag>
              </div>
            </div>
          </div>
          <vue-daum-map
            :app-key="appKey"
            :center.sync="center"
            :level.sync="level"
            :map-type-id="mapTypeId"
            :libraries="libraries"
            :style="mapStyle"
            @load="onLoad"
          />
        </section>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue'
import { ModelSelect } from 'vue-search-select'
import VueDaumMap from 'vue-daum-map'
import config from '@/assets/config/kakao.json'
import { Navigation, Landing, Footer } from '@/components'
import 'vue-search-select/dist/VueSearchSelect.css'

Vue.use(VueDaumMap)
Vue.use(ModelSelect)
export default {
  components: {
    Navigation,
    Landing,
    Footer,
    VueDaumMap,
    ModelSelect
  },
  data () {
    return {
      scrollBase: null,
      activeTabs: 0,
      busRoutes: [
        {
          label: '광교중앙역(1번출구)',
          columns: [
            {
              field: 'startsAt',
              label: '도서관 -> 광교중앙역'
            },
            {
              field: 'arrivesAt',
              label: '광교중앙역 -> 학교'
            }
          ],
          data: [
            { id: 1, startsAt: '08:22', arrivesAt: '08:30' },
            { id: 2, startsAt: '08:42', arrivesAt: '08:50' },
            { id: 3, startsAt: '08:52', arrivesAt: '09:00' },
            { id: 4, startsAt: '09:22', arrivesAt: '09:30' },
            { id: 5, startsAt: '09:52', arrivesAt: '10:00' },
            { id: 6, startsAt: '10:07', arrivesAt: '10:15' },
            { id: 7, startsAt: '10:52', arrivesAt: '11:00' },
            { id: 8, startsAt: '11:37', arrivesAt: '11:45' },
            { id: 9, startsAt: '12:52', arrivesAt: '13:00' },
            { id: 10, startsAt: '13:52', arrivesAt: '14:00' },
            { id: 11, startsAt: '14:37', arrivesAt: '14:45' },
            { id: 12, startsAt: '15:52', arrivesAt: '16:00' },
            { id: 13, startsAt: '16:52', arrivesAt: '17:00' },
            { id: 14, startsAt: '18:10', arrivesAt: '-' }
          ]
        },
        {
          label: '사당',
          columns: [
            {
              field: 'placeStart',
              label: '출발장소'
            },
            {
              field: 'timeStart',
              label: '출발시간'
            },
            {
              field: 'timeArrive',
              label: '도착시간'
            }
          ],
          data: [
            { placeStart: '이수역(14번 출구)', timeStart: '07:45', timeArrive: '08:40' },
            { placeStart: '총신대역(7번 출구)', timeStart: '07:48', timeArrive: '08:40' },
            { placeStart: '사당역(4번 출구 홈플러스 앞)', timeStart: '07:51', timeArrive: '08:40' },
            { placeStart: '과천(과천주공 6~7단지 사이)', timeStart: '07:56', timeArrive: '08:40' }
          ]
        },
        {
          label: '목동',
          columns: [
            {
              field: 'placeStart',
              label: '출발장소'
            },
            {
              field: 'timeStart',
              label: '출발시간'
            },
            {
              field: 'timeArrive',
              label: '도착시간'
            }
          ],
          data: [
            { placeStart: '오목교(오목교역 1번 출구 마을버스 회차지점 앞)', timeStart: '07:10', timeArrive: '08:40' },
            { placeStart: '목동오거리 (목동역 7번 출구)', timeStart: '07:12', timeArrive: '08:40' }
          ]
        },
        {
          label: '금정',
          columns: [
            {
              field: 'placeStart',
              label: '출발장소'
            },
            {
              field: 'timeStart',
              label: '출발시간'
            },
            {
              field: 'timeArrive',
              label: '도착시간'
            }
          ],
          data: [
            { placeStart: '금정역(금정농협 맞은편)', timeStart: '07:50', timeArrive: '08:50' },
            { placeStart: '1번국도 범계사거리 버스정류장', timeStart: '07:58', timeArrive: '08:50' },
            { placeStart: '고천육교 전 기아자동차 대리점 앞', timeStart: '08:08', timeArrive: '08:50' }
          ]
        },
        {
          label: '잠실',
          columns: [
            {
              field: 'placeStart',
              label: '출발장소'
            },
            {
              field: 'timeStart',
              label: '출발시간'
            },
            {
              field: 'timeArrive',
              label: '도착시간'
            }
          ],
          data: [
            { placeStart: '잠실역 롯데 백화점앞(주공522동 건너편)', timeStart: '07:40', timeArrive: '08:40' },
            { placeStart: '가락시장 신 동문 앞', timeStart: '07:45', timeArrive: '07:45' },
            { placeStart: '복정역 3번출구(완불주유소 앞)', timeStart: '07:58', timeArrive: '08:40' }
          ]
        },
        {
          label: '분당',
          columns: [
            {
              field: 'placeStart',
              label: '출발장소'
            },
            {
              field: 'timeStart',
              label: '출발시간'
            },
            {
              field: 'timeArrive',
              label: '도착시간'
            }
          ],
          data: [
            { placeStart: '정자역(5번 출구)', timeStart: '08:05', timeArrive: '08:40' },
            { placeStart: '미금역(7번 출구)', timeStart: '', timeArrive: '08:40' }
          ]
        },
        {
          label: '안산',
          columns: [
            {
              field: 'placeStart',
              label: '출발장소'
            },
            {
              field: 'timeStart',
              label: '출발시간'
            },
            {
              field: 'timeArrive',
              label: '도착시간'
            }
          ],
          data: [
            { placeStart: '안산역 롯데리아 앞 통근버스 승강장', timeStart: '07:30', timeArrive: '08:40' },
            { placeStart: '중앙역앞 시내버스정류장', timeStart: '07:37', timeArrive: '08:40' },
            { placeStart: '한대앞역 1번출구앞', timeStart: '07:42', timeArrive: '08:40' },
            { placeStart: '상록수역 길건너 통근버스승강장', timeStart: '07:47', timeArrive: '08:40' }
          ]
        },
        {
          label: '수원역(등하교)',
          columns: [
            {
              field: 'placeStart',
              label: '출발장소'
            },
            {
              field: 'timeStart',
              label: '출발시간'
            },
            {
              field: 'timeArrive',
              label: '도착시간'
            }
          ],
          data: [
            { placeStart: '수원역 (오전) 9/10번 출구 사이 학생버스승강장', timeStart: '08:15 / 08:20 / 09:30 / 10:30 / 11:30', timeArrive: '' },
            { placeStart: '학교 (오후)', timeStart: '15:00 / 16:00 / 17:00 / 18:10', timeArrive: '' }
          ]
        }
      ],
      buses: {
        types: [
          { label: '시내버스', type: 1 },
          { label: '마을버스', type: 2 },
          { label: '광역버스', type: 3 },
          { label: '시외버스', type: 4 }
        ],
        routes: [
          { etc: '', type: 1, num: '2-2', bound: [4, 1, 8] },
          { etc: '', type: 1, num: '7', bound: [10, 2, 1, 9] },
          { etc: '', type: 1, num: '11-1', bound: [9, 1] },
          { etc: '', type: 1, num: '13-4', bound: [9, 1, 2] },
          { etc: '', type: 1, num: '18', bound: [2, 4, 5] },
          { etc: '', type: 1, num: '20', bound: [2, 6] },
          { etc: '', type: 1, num: '32-3', bound: [2, 1, 7] },
          { etc: '', type: 1, num: '32-4', bound: [2, 1, 7] },
          { etc: '', type: 1, num: '80', bound: [2, 3] },
          { etc: '', type: 1, num: '81', bound: [2, 3, 6] },
          { etc: '', type: 1, num: '88-1', bound: [9, 1, 2] },
          { etc: '', type: 1, num: '99', bound: [8, 5] },
          { etc: '', type: 1, num: '99-2', bound: [8, 5] },
          { etc: '', type: 1, num: '202', bound: [3, 6] },
          { etc: '', type: 1, num: '720-1', bound: [5, 4, 10] },
          { etc: '', type: 1, num: '720-2', bound: [7, 9, 1, 10] },
          { etc: '', type: 2, num: '7', bound: [2] },
          { etc: '', type: 3, num: '1007-1', bound: [14] },
          { etc: '', type: 3, num: '3007', bound: [13] },
          { etc: '평일', type: 3, num: '3008', bound: [13] },
          { etc: '', type: 3, num: '4000', bound: [10] },
          { etc: '', type: 3, num: '7000', bound: [12] },
          { etc: '', type: 3, num: '7001', bound: [12] },
          { etc: '', type: 3, num: '8800', bound: [11] },
          { etc: '', type: 4, num: '8862', bound: [15] }
        ]
      },
      options: [
        { value: 1, text: '수원역' },
        { value: 2, text: '광교.광교중앙.상현역' },
        { value: 3, text: '수원시청역(인계동)' },
        { value: 4, text: '영통.영통역' },
        { value: 5, text: '망포.동탄' },
        { value: 6, text: '병점.오산' },
        { value: 7, text: '봉담.향남' },
        { value: 8, text: '북수원' },
        { value: 9, text: '서수원' },
        { value: 10, text: '수지.죽전.판교.성남' },
        { value: 11, text: '서울(서울역)' },
        { value: 12, text: '서울(사당역)' },
        { value: 13, text: '서울(강남역)' },
        { value: 14, text: '서울(잠실역)' },
        { value: 15, text: '인천' }
      ],
      item: {
        value: '',
        text: ''
      },
      mapStyle: {
        width: '100%',
        height: '500px',
        margin: '1rem 0'
      },
      appKey: config.kakao.api.rest,
      center: { lat: 37.2791647, lng: 127.0431981 },
      level: 3,
      zoom: false,
      mapTypeId: VueDaumMap.MapTypeId.NORMAL,
      libraries: [],
      map: null,
      apiCallback: 'https://map.kakao.com/bus/stop.json?busstopid=',
      stops: ['BS72693', 'BS72549', 'BS72694', 'BS72548', 'BS320880', 'BS320876', 'BS320881'],
      stopsInfo: [],
      schoolBus: {
        data: {
          regional: [
            { route: '하교', placeStart: '율곡관 출발버스: 수원역 / 광교중앙역 그외 하교차량 없음', timeStart: '18:10', timeArrive: '' }
          ],
          townShuttle: [
            { route: '06:00' },
            { route: '06:19' },
            { route: '06:38' },
            { route: '06:57' },
            { route: '07:16' },
            { route: '07:35' },
            { route: '07:54' },
            { route: '08:13' },
            { route: '08:32' },
            { route: '08:51' },
            { route: '09:10' },
            { route: '09:29' },
            { route: '10:00' },
            { route: '10:30' },
            { route: '11:00' },
            { route: '11:25' },
            { route: '11:44' },
            { route: '12:03' },
            { route: '12:22' },
            { route: '12:41' },
            { route: '13:00' },
            { route: '13:19' },
            { route: '13:38' },
            { route: '13:57' },
            { route: '14:16' },
            { route: '14:35' },
            { route: '14:54' },
            { route: '15:13' },
            { route: '15:45' },
            { route: '16:15' },
            { route: '16:45' },
            { route: '17:09' },
            { route: '17:28' },
            { route: '17:47' },
            { route: '18:06' },
            { route: '18:25' },
            { route: '18:44' },
            { route: '19:03' },
            { route: '19:28' },
            { route: '19:56' },
            { route: '20:21' },
            { route: '20:46' },
            { route: '21:11' },
            { route: '21:36' },
            { route: '21:51' },
            { route: '22:30' }
          ]
        },
        columns: {
          townShuttle: [
            {
              field: 'route',
              label: '시간'
            }
          ]
        }
      }
    }
  },
  mounted () {
    this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
    const kakaoMap = document.createElement('script')
    kakaoMap.setAttribute('src', `//dapi.kakao.com/v2/maps/sdk.js?appkey=${config.kakao.api.rest}&autoload=false`)
    document.body.appendChild(kakaoMap)
  },
  methods: {
    onLoad (map) {
      this.map = map
    }
  }
}
</script>

<style lang="scss" scoped>
#map {
  width: 100vw;
  height: 400px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: .5rem;
}

span.tag {
  margin: 0 .2rem;
}
</style>
