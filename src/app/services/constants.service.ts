import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root'
})


export class ConstantsService {

    constructor(
    ) {
    }
    public static DEFAULT_COUNTRY_ID = 16

    public static USER_ROLES = {
        CUSTOMER: 'customer',
        BUSINESS_OWNER: 'business',
        ADMIN: 'admin',
    }
    static DAYS = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ]

    static SUBSCRIPTION_PLANS = [
        {
              title: 'Platinum',
              listings: 5,
              price: 5,
              image: '/assets/images/plan-one.png'
        },
        {
              title: 'Gold',
              listings: 10,
              price: 10,
              image: '/assets/images/plan-two.png'
        },
        {
            title: 'Diamond',
            listings: 15,
            price: 15,
            image: '/assets/images/plan-three.png'
        }
  ]
    public static AMENITY_CATEGORIES = {
        security: 'SECURITY',
        property: 'PROPERTY'
    }

    public static STATUSES = {
        active: 'Active',
        inactive: 'InActive'
    }

    public static BANNER_TYPE = {
        top: 'Top Banner',
        bottom: 'Bottom Banner'
    }

    public static BANNER_OPEN_IN = {
        same: 'Same Window',
        new: 'New Window'
    }

    public static PROPERTY_STATUS = {
        active: 'New Listing',
        offerInProgress: 'Offer in Progress',
        rental: 'Rental',
        rentalSale: 'Rental/Sale',
        auction: 'Auction',
        showHouse: 'Show House',
        reduced: 'Reduced',
        notTransferDuties: 'Not Transfer Duties'
    }

    public static PROPERTY_STATUS_ADMIN = {
        active: 'New Listing',
        offerInProgress: 'Offer in Progress',
        rental: 'Rental',
        rentalSale: 'Rental/Sale',
        auction: 'Auction',
        showHouse: 'Show House',
        reduced: 'Reduced',
        notTransferDuties: 'Not Transfer Duties'
    }

    public static OPERATIONS = {
        sale: 'Sale',
        rent: 'Rent',
        'sale&rent': 'Sale & Rent'
    }

    public static ARTICLE_STATUSES = {
        publish: 'PUBLISH',
        draft: 'DRAFT'
    }

    public static ARTICLE_TYPES = {
        Blog: 'BLOG',
        News: 'NEWS',
        Articles: 'ARTICLES'
    }


    public static BANNER_PLANS = {
        30: '30 days',
        60: '60 days',
        90: '90 days',
        120: '120 days'
    }

    public static BUILDING_SIZE_UNIT = {
        square_meter: 'Square Meter',
        square_feet: 'Square Feet',
    }

    public static PROPERTY_SIZE_UNIT = {
        acre: 'Acre',
        hectare: 'Hectare',
        square_meter: 'Square Meter'
    }

    public LANGUAGES = {
        en: 'English',
        ch: '中文',
        fr: 'French'
    }

    public DATE_TIME_FORMAT = {
        SHORT_DATE: 'DD-MM-YYYY',
        DATE: 'dddd, MMMM DD, YYYY',
        TIME: 'HH:mm',
        DATE_TIME: 'dddd, MMMM DD, YYYY HH:mm',
        AM_PM: 'HH:mm A'
    }
}

