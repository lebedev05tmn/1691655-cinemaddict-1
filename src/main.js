import FilmsModel from './model/films-model';
import BoardPresenter from './presenter/board-presenter';
import FooterPresenter from './presenter/footer-presenter';
import HeaderPresenter from './presenter/header-presenter';

const mainContainer = document.querySelector('.main');
const headerContainer = document.querySelector('.header');
const footerContainer = document.querySelector('.footer__statistics');

const filmsModel = new FilmsModel();

const navigation = new HeaderPresenter(headerContainer);
const presenter = new BoardPresenter(mainContainer, filmsModel);
const footer = new FooterPresenter(footerContainer);

navigation.init();
presenter.init();
footer.init();

