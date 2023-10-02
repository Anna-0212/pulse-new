// подключаем карусель
//$ - показывает, что мы работаем с библиотекой jquery
$(document).ready(function() {
    $('.carousel__inner').slick({ 
        speed: 1200,
        // adaptiveHeight: true,
        prevArrow: '<button type="button" class="slick-prev"><img src="icons/left.png"></button>',
        nextArrow: '<button type="button" class="slick-next"><img src="icons/right.png"></button>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    dots: true,
                    arrows: false
                }
            }
        ]
    });

    //подключаем наши табы
    // копируем jquery  и адаптируем под наш код изменяя классы на наши. этот скрипт довольно универсален и работает на большое количество табов


    $('ul.catalog__tabs').on('click', 'li:not(.catalog__tab_active)', function() {
        $(this)
        // тут мы настраиваем кнопки переключения "для фитнеса", "для бега" и т.д., меняется цвет
        .addClass('catalog__tab_active').siblings().removeClass('catalog__tab_active')
          // тут при нажатии кнопки выше идет отбор с определенным индексом среди наших табов в каталоге
        .closest('div.container').find('div.catalog__content').removeClass('catalog__content_active').eq($(this).index()).addClass('catalog__content_active');
    });

    // пишем скрипт, который будет переключать информацию непосредственно внутри каждой карточки
// $ в JQuery - это ф-ция, которая позволяет нам получать все эл-ты по определенному селектору (классы, id, теги, комбинации)
// напр., у нас есть 10 ссылок, к-е мы получили('.catalog-item__link')
// и для каждой ссылки each мы будем выполнять какие-то действия
// эта комбинация -$(this) и будет ссылаться на к-ю ссылку, которую мы в данный момент "перебираем"
    // $('.catalog-item__link').each(function(i) {
    //     $(this).on('click', function(e) {
    //         e.preventDefault();
    //         $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
    //         $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
    //     })
    // });

    //теперь настраиваем, чтоб при клике на кнопку назад, все возвращалось на первую часть таба
    // $('.catalog-item__back').each(function(i) {
    //     $(this).on('click', function(e) {
    //         e.preventDefault();
    //         $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
    //         $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
    //     })
    // });

    //это можно все оптимизировать чтобы меньше кода повторялось
// теперь у нас есть ф-ция toggleSlide, которая берет ссылку, к-ю мы ей передаем ('.catalog-item__link'.catalog-item__back');)
//и выполняет с ней операции по замене toggleClass (туда и обратно)

function toggleSlide(item) {
    $(item).each(function(i) {
        $(this).on('click', function(e) {
            e.preventDefault();
            $('.catalog-item__content').eq(i).toggleClass('catalog-item__content_active');
            $('.catalog-item__list').eq(i).toggleClass('catalog-item__list_active');
        })
    });
};

toggleSlide('.catalog-item__link');
toggleSlide('.catalog-item__back');


//Modal

$('[data-modal=consultation]').on('click', function() {
    $('.overlay, #consultation').fadeIn('slow');
});

//прописываем для крестиков, чтоб окошко закрывалось при нажатии
$('.modal__close').on('click', function() {
    $('.overlay, #consultation, #thanks, #order').fadeOut('slow');
});

//делаем, чтоб в форме заказа правильно отображались названия товаров.
// прописываем кнопки на товары в каталоге, чтоб появлялась форма для заказа
$('.button_mini').each(function(i) {
    $(this).on('click', function() {
        $('#order .modal__descr').text($('.catalog-item__subtitle').eq(i).text());
        $('.overlay, #order').fadeIn('slow');
    })
});


 // подключаем плагин валидации форм 

    // плагин берет только первую форму с таким классом (.feed-form'). остальные формы уже не сработают
    // $('.feed-form').validate();
    // поэтому чаще всего к формам добавляют уникальный индификатор, по которому и находятся непосредственно нужные нам элементы. но, чтобы каждый раз их не задавать, мы можем воспользоваться селекторами вложенности (например в блоке #consultation есть form)
    // $('#consultation-form').validate();
    // $('#consultation form').validate({
    //     rules: {
    //         name: "required",
    //         phone: "required",
    //         email: {
    //             required: true,
    //             email: true
    //         }
    //     }
    // });
    // $('#order form').validate();

    function validateForms(form){
        $(form).validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                phone: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                name: {
                    required: "Пожалуйста, введите свое имя",
                    minlength: jQuery.validator.format("Введите {0} символа!")
                },
                phone: "Пожалуйста, введите свой номер телефона",
                email: {
                    required: "Пожалуйста, введите свою почту",
                    email: "Неправильно введен адрес почты"
                }
            }
        });
    };
    
    validateForms('#consultation-form');
    validateForms('#consultation form');
    validateForms('#order form');

    //прописываем для маски ввода номеров 
$('input[name=phone]').mask("+7 (999) 999-99-99");

//скрипт для отправки писем через форму
$('form').submit(function(e) {
    e.preventDefault();
//прописываем маленький кусочек кода при котором если форма не прошла валидацию, то она не будет отправляться
    if (!$(this).valid()) {
        return;
    }

    //при помощи ajax отправляем данные на сервер
    $.ajax({
        type: "POST",
        url: "mailer/smart.php",
        data: $(this).serialize()
    }).done(function() {
        $(this).find("input").val("");

        //чтобы после отправки запроса его форма закрывалась и всплывало благодарственное окошко
        $('#consultation, #oder').fadeOut();
        $('.overlay, #thanks').fadeIn('slow');


        $('form').trigger('reset');
    });
    return false;
});

//Smooth scroll and pageup (плавний скролл для ссилок та pageup)

$(window).scroll(function() {
    if ($(this).scrollTop() > 1600) {
        $('.pageup').fadeIn();
    } else {
        $('.pageup').fadeOut();
    }
});

$("a[href=#up]").click(function(){
    const _href = $(this).attr("href");
    $("html, body").animate({scrollTop: $(_href).offset().top+"px"});
    return false;
});


new WOW().init();

});