CREATE TABLE "ai_advisor_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"financial_record_id" text,
	"messages" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_classification" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"color" text NOT NULL,
	"min_debt_to_income_ratio" numeric(5, 4),
	"max_debt_to_income_ratio" numeric(5, 4),
	"min_emergency_fund_ratio" numeric(5, 4),
	"priority" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_projection" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"record_id" text NOT NULL,
	"month" integer NOT NULL,
	"projected_income" numeric(10, 2) NOT NULL,
	"projected_expenses" numeric(10, 2) NOT NULL,
	"projected_emergency_fund" numeric(10, 2) NOT NULL,
	"net_cash_flow" numeric(10, 2) NOT NULL,
	"is_bankruptcy_point" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_record" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"fixed_income" numeric(10, 2) NOT NULL,
	"extra_income" numeric(10, 2) DEFAULT '0',
	"routine_expenses" numeric(10, 2) NOT NULL,
	"debt_installments" numeric(10, 2) NOT NULL,
	"emergency_fund" numeric(10, 2) NOT NULL,
	"inflation_rate" numeric(5, 4) DEFAULT '0.025',
	"classification" text NOT NULL,
	"debt_to_income_ratio" numeric(5, 4),
	"bankruptcy_projection" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_advisor_session" ADD CONSTRAINT "ai_advisor_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_advisor_session" ADD CONSTRAINT "ai_advisor_session_financial_record_id_financial_record_id_fk" FOREIGN KEY ("financial_record_id") REFERENCES "public"."financial_record"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_projection" ADD CONSTRAINT "financial_projection_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_projection" ADD CONSTRAINT "financial_projection_record_id_financial_record_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."financial_record"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_record" ADD CONSTRAINT "financial_record_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;