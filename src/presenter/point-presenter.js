import EditingForm from "../view/editing-form";
import Point from "../view/point";
import {remove, render, RenderPosition, replaceChild} from "../utils/render";
import {UpdateType, UserAction} from "../const";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};


export default class PointPresenter {
  constructor(pointListComponent, changeData, changeMode) {
    this._pointListComponent = pointListComponent;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseForm = this._handleCloseForm.bind(this);
    this._handleOpenForm = this._handleOpenForm.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleToggleFavorite = this._handleToggleFavorite.bind(this);
    this._handleDeletePointClick = this._handleDeletePointClick.bind(this);
    this._mode = Mode.DEFAULT;
  }

  init(point) {
    this._point = point;
    this.renderPointComponent();
    this.renderEditComponent();
  }

  renderPointComponent() {
    const prevPointComponent = this._pointComponent;
    this._pointComponent = new Point(this._point);
    this._pointComponent.setClickOpenFormHandler(this._handleOpenForm);
    this._pointComponent.setHandleToggleFavorite(this._handleToggleFavorite);
    if (!prevPointComponent) {
      render(this._pointListComponent, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.DEFAULT) {
      replaceChild(prevPointComponent, this._pointComponent);
    }
    remove(prevPointComponent);
  }

  renderEditComponent() {
    const prevPointEditComponent = this._pointEditComponent;
    this._pointEditComponent = new EditingForm(this._point);
    this._pointEditComponent.setSubmitFormHandler(this._handleFormSubmit);
    this._pointEditComponent.setCloseFormClickHandler(this._handleCloseForm);
    this._pointEditComponent.setDeletePointClickHandler(this._handleDeletePointClick);
    if (!prevPointEditComponent) {
      render(this._pointListComponent, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }
    if (this._mode === Mode.EDITING) {
      replaceChild(prevPointEditComponent, this._pointComponent);
      this._mode = Mode.DEFAULT;
    }
    remove(prevPointEditComponent);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isSaving: true
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._handleCloseForm();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _handleToggleFavorite(point) {
    this._changeData(
        UserAction.UPDATE_POINT, UpdateType.PATCH, Object.assign({}, point, {isFavorite: !point.isFavorite})
    );
  }

  _handleDeletePointClick(point) {
    this._changeData(
        UserAction.DELETE_POINT, UpdateType.MAJOR, point
    );
  }

  _handleOpenForm() {
    replaceChild(this._pointComponent, this._pointEditComponent);
    this._pointEditComponent.setCloseFormClickHandler(this._handleCloseForm);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _handleCloseForm() {
    this._pointEditComponent.reset(this._point);
    replaceChild(this._pointEditComponent, this._pointComponent);
    this._pointComponent.setClickOpenFormHandler(this._handleOpenForm);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleFormSubmit(point) {
    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, point);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._handleCloseForm();
    }
  }

}
