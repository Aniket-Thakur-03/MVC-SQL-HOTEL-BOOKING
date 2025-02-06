# Hotel Booking Website

This is a Hotel Booking Website made in Node and Vite(React) and uses PostgreSQL Database.

Frontend Credit: https://youtu.be/wSlEJOn-gJQ?si=-PUZOPp4ne9EOipR

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in backend folder

`PORT` 8000 or your-choice

`CORS_ORIGIN` your-frontend-link

`DB_PASSWORD` postgres-database-password

`DB_USER` postgres

`DB_PORT` 5432 or your-postgres-database-port

`DB_NAME` your-postgres-database-name

`ACCESS_TOKEN_SECRET` your-jwt-secret-key

`ACCESS_TOKEN_EXPIRY` 1d

`GOOGLE_MAIL` your-email

`GOOGLE_APP_PASSWORD` google-app-password

> [!IMPORTANT]
> Make GOOGLE APP password in your google account settings
> This is required for making mails to users

## Run Locally

Clone the project

```bash
  git clone https://github.com/An1ket-thakur/Hotel_Booking_Website.git
```

Go to the Client directory

```bash
  cd Client
```

Install dependencies

```bash
  npm install
```

Start the frontend

```bash
  npm run dev
```

Open new terminal and Go to Server directory

```bash
  cd Server
```

Install dependencies

```bash
  npm install
```

Start the Server

```bash
  npm start
```

> [!IMPORTANT]  
> Create tables in your schema of postgress database(DB_NAME)
> Tables Name: users, rooms, bookings, cities, countries, states, invoices, locations, roomtypes, useradmins, features, adminpreferences, extraservices

```
CREATE TABLE hotel_booking.users (
	user_id serial4 NOT NULL,
	username varchar(255) NOT NULL,
	full_name varchar(255) NULL,
	email varchar(255) NOT NULL,
	phone_no varchar(255) NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'simple_user'::character varying NOT NULL,
	is_verified bool DEFAULT false NOT NULL,
	verification_token varchar(255) NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT users_email_key UNIQUE (email),
	CONSTRAINT users_email_key1 UNIQUE (email),
	CONSTRAINT users_email_key2 UNIQUE (email),
	CONSTRAINT users_email_key3 UNIQUE (email),
	CONSTRAINT users_pk PRIMARY KEY (user_id)
);
```

```
CREATE TABLE hotel_booking.rooms (
	room_id serial4 NOT NULL,
	meals_available bool DEFAULT true NOT NULL,
	veg_meals_price int4 DEFAULT 100 NOT NULL,
	non_veg_meals_price int4 DEFAULT 200 NOT NULL,
	retail_price int4 NOT NULL,
	selling_price int4 NOT NULL,
	no_of_rooms int4 DEFAULT 5 NOT NULL,
	image_link_1 varchar(255) NOT NULL,
	image_link_2 varchar(255) NOT NULL,
	state varchar(255) DEFAULT 'inactive'::character varying NOT NULL,
	created_by varchar(255) NOT NULL,
	updated_by varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	roomtype_id int4 NOT NULL,
	location_id int4 NOT NULL,
	image_link_3 varchar NULL,
	image_link_4 varchar NULL,
	image_link_5 varchar NULL,
	image_link_6 varchar NULL,
	CONSTRAINT rooms_pk PRIMARY KEY (room_id),
	CONSTRAINT rooms_locations_fk FOREIGN KEY (location_id) REFERENCES hotel_booking.locations(location_id) ON DELETE CASCADE,
	CONSTRAINT rooms_roomtype_id_fkey FOREIGN KEY (roomtype_id) REFERENCES hotel_booking.roomtypes(roomtype_id)
);
```

```
CREATE TABLE hotel_booking.bookings (
	booking_id serial4 NOT NULL,
	user_id int4 NOT NULL,
	room_id int4 NOT NULL,
	meal_chosen bool DEFAULT false NOT NULL,
	meal_type varchar(255) NULL,
	breakfast bool NULL,
	lunch bool NULL,
	dinner bool NULL,
	meal_price int4 DEFAULT 0 NOT NULL,
	payment_due int4 NOT NULL,
	room_price int4 NOT NULL,
	booking_status varchar(20) DEFAULT 'pending'::character varying NOT NULL,
	payment_status varchar(20) DEFAULT 'unpaid'::character varying NOT NULL,
	checked_status varchar(20) DEFAULT 'not_checked'::character varying NOT NULL,
	no_of_days int4 NOT NULL,
	guest_name varchar(255) NOT NULL,
	guest_email varchar(255) NOT NULL,
	guest_phone_no bpchar(10) NOT NULL,
	check_in_date date NOT NULL,
	check_out_date date NOT NULL,
	no_of_adults int4 NOT NULL,
	no_of_kids int4 NOT NULL,
	guest_aadhar_card bpchar(12) NOT NULL,
	country_id int4 NOT NULL,
	state_id int4 NOT NULL,
	city_id int4 NOT NULL,
	address varchar(255) NOT NULL,
	special_requests text NULL,
	amount_paid int4 DEFAULT 0 NOT NULL,
	cancellation_reasons text NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	location_id int4 NOT NULL,
	selected_services jsonb NULL,
	services_price int4 DEFAULT 0 NOT NULL,
	CONSTRAINT bookings_pk PRIMARY KEY (booking_id),
	CONSTRAINT bookings_city_id_fkey FOREIGN KEY (city_id) REFERENCES hotel_booking.cities(city_id),
	CONSTRAINT bookings_country_id_fkey FOREIGN KEY (country_id) REFERENCES hotel_booking.countries(country_id),
	CONSTRAINT bookings_locations_fk FOREIGN KEY (location_id) REFERENCES hotel_booking.locations(location_id),
	CONSTRAINT bookings_room_id_fkey FOREIGN KEY (room_id) REFERENCES hotel_booking.rooms(room_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT bookings_state_id_fkey FOREIGN KEY (state_id) REFERENCES hotel_booking.states(state_id),
	CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES hotel_booking.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

```
CREATE TABLE hotel_booking.cities (
	city_id serial4 NOT NULL,
	state_id int4 NOT NULL,
	city_std_code varchar(255) NOT NULL,
	"isActive" bool DEFAULT true NOT NULL,
	created_by varchar(255) NOT NULL,
	updated_by varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	city_name varchar NOT NULL,
	CONSTRAINT cities_pk PRIMARY KEY (city_id),
	CONSTRAINT cities_state_id_fkey FOREIGN KEY (state_id) REFERENCES hotel_booking.states(state_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

```
CREATE TABLE hotel_booking.states (
	state_id serial4 NOT NULL,
	country_id int4 NOT NULL,
	state_code varchar(2) NOT NULL,
	state_name varchar(255) NOT NULL,
	"isActive" bool DEFAULT true NOT NULL,
	created_by varchar(255) NOT NULL,
	updated_by varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT states_pk PRIMARY KEY (state_id),
	CONSTRAINT states_country_id_fkey FOREIGN KEY (country_id) REFERENCES hotel_booking.countries(country_id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

```
CREATE TABLE hotel_booking.countries (
	country_id serial4 NOT NULL,
	country_iso_code varchar(3) NOT NULL,
	country_name varchar(255) NOT NULL,
	"isActive" bool DEFAULT true NOT NULL,
	created_by varchar(255) NOT NULL,
	updated_by varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT countries_pk PRIMARY KEY (country_id)
);
```

```
CREATE TABLE hotel_booking.locations (
	location_id serial4 NOT NULL,
	location_name varchar NOT NULL,
	address varchar NOT NULL,
	country varchar NOT NULL,
	state varchar NOT NULL,
	city varchar NOT NULL,
	phoneno varchar NOT NULL,
	"isActive" bool DEFAULT false NOT NULL,
	created_by varchar NOT NULL,
	updated_by varchar NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	pincode varchar NOT NULL,
	latitude numeric NULL,
	longitude numeric NULL,
	CONSTRAINT locations_pk PRIMARY KEY (location_id)
);
```

```
CREATE TABLE hotel_booking.invoices (
	invoice_id serial4 NOT NULL,
	booking_id int4 NOT NULL,
	location_id int4 NOT NULL,
	invoice_date date NOT NULL,
	room_id int4 NOT NULL,
	created_by varchar NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	invoice_url varchar NULL,
	CONSTRAINT invoices_pk PRIMARY KEY (invoice_id),
	CONSTRAINT invoices_bookings_fk FOREIGN KEY (booking_id) REFERENCES hotel_booking.bookings(booking_id),
	CONSTRAINT invoices_locations_fk FOREIGN KEY (location_id) REFERENCES hotel_booking.locations(location_id),
	CONSTRAINT invoices_rooms_fk FOREIGN KEY (room_id) REFERENCES hotel_booking.rooms(room_id)
);
```

```
CREATE TABLE hotel_booking.features (
	feature_id serial4 NOT NULL,
	feature_name varchar NOT NULL,
	feature_url varchar NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	"isActive" bool DEFAULT false NOT NULL,
	updated_by varchar NULL,
	CONSTRAINT features_pk PRIMARY KEY (feature_id)
);
```

```
CREATE TABLE hotel_booking.extraservices (
	service_id serial4 NOT NULL,
	service_name varchar NOT NULL,
	service_price int4 NOT NULL,
	isactive bool DEFAULT false NOT NULL,
	created_by varchar NOT NULL,
	updated_by varchar NOT NULL,
	location_id int4 NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	gst_rate int4 NULL,
	CONSTRAINT extraservices_pk PRIMARY KEY (service_id),
	CONSTRAINT extraservices_locations_fk FOREIGN KEY (location_id) REFERENCES hotel_booking.locations(location_id) ON DELETE CASCADE
);
```

```
CREATE TABLE hotel_booking.adminpreferences (
	preference_id serial4 NOT NULL,
	location_id int4 NULL,
	admin_id int4 NOT NULL,
	feature_id int4 NOT NULL,
	isgranted bool DEFAULT false NOT NULL,
	created_by varchar NOT NULL,
	updated_by varchar NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	CONSTRAINT adminpreferences_pk PRIMARY KEY (preference_id),
	CONSTRAINT adminpreferences_features_fk FOREIGN KEY (feature_id) REFERENCES hotel_booking.features(feature_id),
	CONSTRAINT adminpreferences_locations_fk FOREIGN KEY (location_id) REFERENCES hotel_booking.locations(location_id),
	CONSTRAINT adminpreferences_useradmins_fk FOREIGN KEY (admin_id) REFERENCES hotel_booking.useradmins(admin_id)
);
```

```
CREATE TABLE hotel_booking.useradmins (
	admin_id serial4 NOT NULL,
	user_id int4 NOT NULL,
	full_name varchar NOT NULL,
	admin_username varchar NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	phoneno varchar NOT NULL,
	created_by varchar NOT NULL,
	updated_by varchar NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	location_id int4 NULL,
	issuper bool DEFAULT false NOT NULL,
	"isActive" bool DEFAULT false NOT NULL,
	CONSTRAINT useradmins_pk PRIMARY KEY (admin_id),
	CONSTRAINT useradmins_unique UNIQUE (email),
	CONSTRAINT useradmins_locations_fk FOREIGN KEY (location_id) REFERENCES hotel_booking.locations(location_id),
	CONSTRAINT useradmins_users_fk FOREIGN KEY (user_id) REFERENCES hotel_booking.users(user_id)
);
```

```
CREATE TABLE hotel_booking.roomtypes (
	roomtype_id serial4 NOT NULL,
	room_name varchar(255) NOT NULL,
	created_by varchar(255) NOT NULL,
	updated_by varchar(255) NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	max_adults int4 NOT NULL,
	max_persons int4 NOT NULL,
	isactive bool DEFAULT false NOT NULL,
	CONSTRAINT roomtypes_pk PRIMARY KEY (roomtype_id)
);
```

## Tech Stack

**Client:** Vite(React), TailwindCSS, React-Router, Zod

**Server:** Node, Express, pg

**Database:** PostgreSQL
