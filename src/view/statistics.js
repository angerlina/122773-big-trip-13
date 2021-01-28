import SmartView from "./smart-view";
import {renderCharts} from "../utils/statistics";

export const createStatisticsTemplate = () => {
  return `<section class="statistics">
          <h2>Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
};

export default class Statistics extends SmartView {
  constructor() {
    super();
  }

  setCharts(points) {
    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const typeCtx = document.querySelector(`.statistics__chart--transport`);
    const timeCtx = document.querySelector(`.statistics__chart--time`);
    this._points = points.slice();
    const BAR_HEIGHT = 55;
    this._uniquePointsTypes = Array.from(new Set(this._points.map((point) => point.type)));
    const height = this._uniquePointsTypes.length;
    moneyCtx.height = BAR_HEIGHT * height;
    typeCtx.height = BAR_HEIGHT * height;
    timeCtx.height = BAR_HEIGHT * height;
    this._labels = this._uniquePointsTypes.map((pointType) => pointType.toUpperCase());
    this._renderMoneyCharts();
    this._renderTypeCharts();
    this._renderTimeCharts();
  }

  _renderMoneyCharts() {
    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    return renderCharts(`MONEY`, moneyCtx, this._labels, () => this._uniquePointsTypes
      .map((uniquePointType) => this._points
      .filter((point) => point.type === uniquePointType)
      .reduce((sum, current) => sum + current.price, 0)), (val) => `€ ${val}`);
  }

  _renderTypeCharts() {
    const typeCtx = document.querySelector(`.statistics__chart--transport`);
    return renderCharts(`TYPE`, typeCtx, this._labels, () => this._uniquePointsTypes
      .map((uniquePointType) => this._points
        .filter((point) => point.type === uniquePointType).length), (val) => `${val}x`);
  }

  _renderTimeCharts() {
    const timeCtx = document.querySelector(`.statistics__chart--time`);
    return renderCharts(`TIME-SPEND`, timeCtx, this._labels, () => this._uniquePointsTypes
      .map((uniquePointType) => this._points
      .filter((point) => point.type === uniquePointType)
      .reduce((sum, current) => sum + current.duration, 0))
      .map((durationInMinutes) => Math.round(Math.abs(durationInMinutes / (60 * 24)))), (val) => `${val}D`);
  }


  getTemplate() {
    return createStatisticsTemplate();
  }
}
