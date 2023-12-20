import CommentsModel from './model/comments-model';
import FilmsModel from './model/films-model';
import BoardPresenter from './presenter/board-presenter';
import FooterPresenter from './presenter/footer-presenter';
import HeaderPresenter from './presenter/header-presenter';
import ApiService from './services/api-service';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');
const footerContainer = document.querySelector('.footer__statistics');

const apiService = new ApiService();
const filmsModel = new FilmsModel(apiService);
const commentsModel = new CommentsModel(apiService);

const navigation = new HeaderPresenter(headerContainer);
const presenter = new BoardPresenter({
  mainContainer,
  filmsModel,
  commentsModel,
});
const footer = new FooterPresenter(footerContainer);

navigation.init();
filmsModel.init().finally(() => {
  presenter.init();
});
footer.init();

