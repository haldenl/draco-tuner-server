DROP TABLE IF EXISTS charts;
DROP TABLE IF EXISTS pairs;

CREATE TABLE charts
(
  chart_id integer PRIMARY KEY,
  vegalite text NOT NULL,
  draco text NOT NULL,
  valid integer NOT NULL
);

CREATE TABLE pairs
(
  pair_id integer PRIMARY KEY,
  left_chart_id integer NOT NULL,
  right_chart_id integer NOT NULL,
  comparator text NOT NULL,
  FOREIGN KEY (left_chart_id) REFERENCES charts(chart_id),
  FOREIGN KEY (right_chart_id) REFERENCES charts(chart_id)
);
