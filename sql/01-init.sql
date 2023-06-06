CREATE TABLE public.branch_type (
	branch_type_id SERIAL PRIMARY KEY,
	branch_type_name varchar,
	branch_type_image text
);

CREATE TABLE public.branch (
	branch_id SERIAL PRIMARY KEY,
	branch_name varchar,
	fk_branch_type SERIAL NOT NULL
);

ALTER TABLE public.branch ADD CONSTRAINT branch_fk FOREIGN KEY (fk_branch_type) REFERENCES branch_type(branch_type_id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE public.store (
	store_id SERIAL PRIMARY KEY,
	store_name varchar(250),
	store_rating numeric,
	is_promotion bool,
	fk_branch SERIAL NOT NULL,
	store_image text
);

ALTER TABLE public.store ADD CONSTRAINT store_fk FOREIGN KEY (fk_branch) REFERENCES branch(branch_id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE public.food_type (
	food_type_id SERIAL PRIMARY KEY,
	food_type_name varchar(250),
	fk_store_id SERIAL NOT NULL,
	food_type_image text
);

ALTER TABLE public.food_type ADD CONSTRAINT food_type_fk FOREIGN KEY (fk_store_id) REFERENCES store(store_id) ON DELETE CASCADE ON UPDATE CASCADE;


CREATE TABLE public.food (
	food_id SERIAL PRIMARY KEY,
	food_name varchar(250),
	price numeric,
	is_addon bool,
	fk_food_type SERIAL NOT NULL,
	fk_store_id SERIAL NOT NULL,
	food_image text
);

ALTER TABLE public.food ADD CONSTRAINT food_fk FOREIGN KEY (fk_food_type) REFERENCES food_type(food_type_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.food ADD CONSTRAINT store_fk FOREIGN KEY (fk_store_id) REFERENCES store(store_id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE public.addons (
	addons_id SERIAL PRIMARY KEY,
	addons_name varchar(250),
	addons_price numeric,
	fk_store_id SERIAL NOT NULL
);

ALTER TABLE public.addons ADD CONSTRAINT addons_fk FOREIGN KEY (fk_store_id) REFERENCES store(store_id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE public.group_select (
	group_select_id SERIAL PRIMARY KEY,
	min_select numeric,
	must_select numeric,
	max_select numeric,
	is_selected bool,
	fk_store_id SERIAL NOT NULL
);

ALTER TABLE public.group_select ADD CONSTRAINT group_select_fk FOREIGN KEY (fk_store_id) REFERENCES store(store_id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE public.group_select_addons (
	group_select_addons_id SERIAL PRIMARY KEY,
	fk_group_select SERIAL NOT NULL,
	fk_addons SERIAL NOT NULL
);

ALTER TABLE public.group_select_addons ADD CONSTRAINT group_select_addons_fk FOREIGN KEY (fk_addons) REFERENCES addons(addons_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.group_select_addons ADD CONSTRAINT group_select_addons_fk_1 FOREIGN KEY (fk_group_select) REFERENCES group_select(group_select_id) ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE public.food_group_select (
	food_group_select_id SERIAL PRIMARY KEY,
	fk_food_id SERIAL NOT NULL,
	fk_group_select_id SERIAL NOT NULL
);

ALTER TABLE public.food_group_select ADD CONSTRAINT food_group_select_fk FOREIGN KEY (fk_food_id) REFERENCES food(food_id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE public.food_group_select ADD CONSTRAINT food_group_select_fk_1 FOREIGN KEY (fk_group_select_id) REFERENCES group_select(group_select_id) ON DELETE CASCADE ON UPDATE CASCADE;