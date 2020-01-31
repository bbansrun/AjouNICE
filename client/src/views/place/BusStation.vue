<template>
	<div class="wrapper">
		<Navigation :scrollBase="scrollBase" />
		<Landing ref="scrollBase" title="Ajou버스" description="학교 주변에서 이용할 수 있는 교통수단을 알려드립니다." background="https://www.dhnews.co.kr/news/photo/201905/102956_103026_2813.jpg" />
		<div class="container">
			<section class="shuttle">
				<article>
					<header class="underline underline-inline-block">학교 셔틀버스</header>
					<b-table :data="schoolBus.data.gwanggyo" :columns="schoolBus.columns.gwanggyo">
						<template slot="footer">
							<div class="has-text-right">
								학교버스 등하교노선
							</div>
						</template>
					</b-table>
					<b-table :data="schoolBus.data.regional" :columns="schoolBus.columns.regional">
						<template slot="footer">
							<div class="has-text-right">
								학교버스 등하교노선
							</div>
						</template>
					</b-table>
				</article>
			</section>
			<section class="ord-bus">
				<article>
					<header class="underline underline-inline-block">마을버스</header>
					<b-table :data="schoolBus.data.townShuttle" :columns="schoolBus.columns.townShuttle">
						<template slot="footer">
							<div class="has-text-right">
								학교버스 등하교노선
							</div>
						</template>
					</b-table>
				</article>
				<article>
					<header class="underline underline-inline-block">일반 시내/광역버스</header>
					<div class="buses">
						<model-select :options="options"
							v-model="item"
							placeholder="목적지를 선택하시면 해당 방향 버스노선이 정렬됩니다.">
						</model-select>
						<div class="routes" v-for="type in buses.types" :key="type.type">
							<h4>{{ type.label }}</h4>
							<span v-if="item.value && buses.routes.filter(elem => (elem.type === type.type && elem.bound.includes(item.value))).length === 0">없음</span>
							<b-tag
								v-for="route in buses.routes.filter(elem => elem.type === type.type)"
								:key="route.num"
								:type="{ 'is-success': route.type === 1, 'is-warning': route.type === 2, 'is-danger': route.type === 3, 'is-info': route.type === 4 }"
								v-show="item.value === '' || (item.value && route.bound.includes(item.value))">
								{{ route.num }}
							</b-tag>
						</div>
					</div>
					<vue-daum-map
						:appKey="appKey"
						:center.sync="center"
						:level.sync="level"
						:mapTypeId="mapTypeId"
						:libraries="libraries"
						@load="onLoad"
						:style="mapStyle"
					/>
				</article>
			</section>
		</div>
		<Footer />
	</div>
</template>

<script>
import Vue from 'vue'
import { Tag } from 'buefy'
import { ModelSelect } from 'vue-search-select'
import VueDaumMap from 'vue-daum-map'
import axios from 'axios'
import Navigation from '@/components/Navigation.vue'
import Landing from '@/components/Landing.vue'
import Footer from '@/components/Footer.vue'
import 'vue-search-select/dist/VueSearchSelect.css'

Vue.use(Tag)
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
	data() {
		return {
			scrollBase: null,
			buses: {
				types: [
					{ label: '시내버스', type: 1 },
					{ label: '마을버스', type: 2 },
					{ label: '광역버스', type: 3 },
					{ label: '시외버스', type: 4 },
				],
				routes: [
					{ type: 1, num: '2-2', bound: [4, 1, 8] },
					{ type: 1, num: '7', bound: [10, 2, 1, 9] },
					{ type: 1, num: '11-1', bound: [9, 1] },
					{ type: 1, num: '13-4', bound: [9, 1, 2] },
					{ type: 1, num: '18', bound: [2, 4, 5] },
					{ type: 1, num: '20', bound: [2, 6] },
					{ type: 1, num: '32-3', bound: [2, 1, 7] },
					{ type: 1, num: '32-4', bound: [2, 1, 7] },
					{ type: 1, num: '80', bound: [2, 3] },
					{ type: 1, num: '81', bound: [2, 3, 6] },
					{ type: 1, num: '88-1', bound: [9, 1, 2] },
					{ type: 1, num: '99', bound: [8, 5] },
					{ type: 1, num: '99-2', bound: [8, 5] },
					{ type: 1, num: '202', bound: [3, 6] },
					{ type: 1, num: '720-1', bound: [5, 4, 10] },
					{ type: 1, num: '720-2', bound: [7, 9, 1, 10] },
					{ type: 2, num: '7', bound: [2] },
					{ type: 3, num: '1007-1', bound: [14] },
					{ type: 3, num: '3007', bound: [13] },
					{ type: 3, num: '3008', bound: [13] },
					{ type: 3, num: '4000', bound: [10] },
					{ type: 3, num: '7000', bound: [12] },
					{ type: 3, num: '7001', bound: [12] },
					{ type: 3, num: '8800', bound: [11] },
					{ type: 4, num: '8862', bound: [15] },
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
				{ value: 15, text: '인천' },
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
			appKey: '57ca092a89b95b1726db4a29813a43c5',
			center: { lat : 37.2791647, lng : 127.0431981 },
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
					gwanggyo: [
						{ id: 1, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '08:22', arrivesAt: '08:30', type: '학교버스' },
						{ id: 2, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '08:42', arrivesAt: '08:50', type: '학교버스' },
						{ id: 3, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '08:52', arrivesAt: '09:00', type: '학교버스' },
						{ id: 4, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '09:22', arrivesAt: '09:30', type: '학교버스' },
						{ id: 5, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '09:52', arrivesAt: '10:00', type: '학교버스' },
						{ id: 6, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '10:07', arrivesAt: '10:15', type: '학교버스' },
						{ id: 7, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '10:52', arrivesAt: '11:00', type: '학교버스' },
						{ id: 8, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '11:37', arrivesAt: '11:45', type: '학교버스' },
						{ id: 9, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '12:52', arrivesAt: '13:00', type: '학교버스' },
						{ id: 10, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '13:52', arrivesAt: '14:00', type: '학교버스' },
						{ id: 11, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '14:37', arrivesAt: '14:45', type: '학교버스' },
						{ id: 12, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '15:52', arrivesAt: '16:00', type: '학교버스' },
						{ id: 13, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '16:52', arrivesAt: '17:00', type: '학교버스' },
						{ id: 14, startsFrom: '광교중앙(아주대)역 1번출구', startsAt: '18:10', arrivesAt: '-', type: '학교버스' },
					],
					regional: [
						{ route: '사당역(등교)', placeStart: '이수역(14번 출구)', timeStart: '07:45', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '사당역(등교)', placeStart: '총신대역(7번 출구)', timeStart: '07:48', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '사당역(등교)', placeStart: '사당역(4번 출구 홈플러스 앞)', timeStart: '07:51', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '사당역(등교)', placeStart: '과천(과천주공 6~7단지 사이)', timeStart: '07:56', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '목동(등교)', placeStart: '오목교(오목교역 1번 출구 마을버스 회차지점 앞)', timeStart: '07:10', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '목동(등교)', placeStart: '목동오거리 (목동역 7번 출구)', timeStart: '07:12', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '금정역(등교)', placeStart: '금정역(금정농협 맞은편)', timeStart: '07:50', timeArrive: '08:50', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '금정역(등교)', placeStart: '1번국도 범계사거리 버스정류장', timeStart: '07:58', timeArrive: '08:50', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '금정역(등교)', placeStart: '고천육교 전 기아자동차 대리점 앞', timeStart: '08:08', timeArrive: '08:50', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '잠실(등교)', placeStart: '잠실역 롯데 백화점앞(주공522동 건너편)', timeStart: '07:40', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '잠실(등교)', placeStart: '가락시장 신 동문 앞', timeStart: '07:45', timeArrive: '07:45', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '잠실(등교)', placeStart: '복정역 3번출구(완불주유소 앞)', timeStart: '07:58', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '안산(등교)', placeStart: '안산역 롯데리아 앞 통근버스 승강장', timeStart: '07:30', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '안산(등교)', placeStart: '중앙역앞 시내버스정류장', timeStart: '07:37', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '안산(등교)', placeStart: '한대앞역 1번출구앞', timeStart: '07:42', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '안산(등교)', placeStart: '상록수역 길건너 통근버스승강장', timeStart: '07:47', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '분당/정자역(등교)', placeStart: '정자역(5번 출구)', timeStart: '08:05', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '분당/정자역(등교)', placeStart: '미금역(7번 출구)', timeStart: '', timeArrive: '08:40', fareTicket: '1,300', fareCredit: '1,500' },
						{ route: '수원역(등하교)', placeStart: '수원역 로터리 9/10번 출구 사이 학생버스 승강장', timeStart: '주간 수시운행 오전 (수원역) 08:15 / 08:20 / 09:30 / 10:30 / 11:30 오후(학교) 15:00 / 16:00 / 17:00 / 18:10', timeArrive: '', fareTicket: '무료운행', fareCredit: '무료운행' },
						{ route: '하교', placeStart: '율곡관 출발버스: 수원역 / 광교중앙역 그외 하교차량 없음', timeStart: '18:10', timeArrive: '', fareTicket: '1,300', fareCredit: '1,500' },
					],
					townShuttle: [
						{ route: '06:00', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '06:19', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '06:38', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '06:57', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '07:16', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '07:35', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '07:54', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '08:13', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '08:32', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '08:51', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '09:10', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '09:29', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '10:00', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '10:30', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '11:00', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '11:25', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '11:44', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '12:03', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '12:22', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '12:41', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '13:00', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '13:19', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '13:38', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '13:57', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '14:16', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '14:35', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '14:54', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '15:13', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '15:45', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '16:15', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '16:45', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '17:09', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '17:28', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '17:47', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '18:06', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '18:25', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '18:44', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '19:03', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '19:28', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '19:56', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '20:21', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '20:46', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '21:11', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '21:36', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '21:51', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
						{ route: '22:30', etc: '1. 좌측 시간표는 광교중앙역 출발시간입니다. 2. 아주대 도서관 앞 도착 소요시간(약 10분 소요)' },
					]
				},
				columns: {
					gwanggyo: [
						{
							field: 'id',
							label: '회차',
							width: '10',
							numeric: true, 
						},
						{
							field: 'startsFrom',
							label: '출발장소',
							width: '15'
						},
						{
							field: 'startsAt',
							label: '학교 승차장 출발시간 (도서관옆)',
							width: '30'
						},
						{
							field: 'arrivesAt',
							label: '광교중앙역 출발시간 (학교행)',
							width: '30'
						},
						{
							field: 'type',
							label: '운영구분',
							width: '15'
						}
					],
					regional: [
						{
							field: 'route',
							label: '노선'
						},
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
						},
						{
							field: 'fareTicket',
							label: '승차권'
						},
						{
							field: 'fareCredit',
							label: '현금'
						},
					],
					townShuttle: [
						{
							field: 'route',
							label: '광교중앙역 출발 -> 아주대학교 경유 -> 지동시장',
						},
						{
							field: 'etc',
							label: '비고',
						},
					]
				}
			}
		}
	},
	methods: {
		onLoad (map) {
		  this.map = map
        }
	},
	mounted () {
		this.scrollBase = this.$refs.scrollBase.$el.getBoundingClientRect().bottom / 3
		let kakaoMap = document.createElement('script')
		kakaoMap.setAttribute('src', '//dapi.kakao.com/v2/maps/sdk.js?appkey=57ca092a89b95b1726db4a29813a43c5&autoload=false')
		document.body.appendChild(kakaoMap)
	}
}
</script>

<style lang="scss">
#map {
	width: 100vw;
	height: 400px;
}
</style>