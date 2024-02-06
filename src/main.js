import { render } from './framework/render';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import BoardPresenter from './presenter/board-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FooterPresenter from './presenter/footer-presenter';
import HeaderPresenter from './presenter/header-presenter';
import ApiService from './services/api-service';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');
const footerContainer = document.querySelector('.footer__statistics');

const apiService = new ApiService();
const filmsModel = new FilmsModel(apiService);
const filterModel = new FilterModel();

const navigation = new HeaderPresenter(headerContainer);
const filterPresenter = new FilterPresenter(
  mainContainer,
  filterModel,
  filmsModel
);
const boardPresenter = new BoardPresenter(
  mainContainer,
  filmsModel,
  filterModel,
  apiService
);
const footer = new FooterPresenter(footerContainer);

filterPresenter.init();
boardPresenter.init();
navigation.init();

filmsModel.init().finally(() => {
  // filterPresenter.init();
  // boardPresenter.init();
});

footer.init();

