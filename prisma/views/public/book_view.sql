SELECT
  DISTINCT b.id,
  b.name,
  b.price,
  b.language,
  b.description,
  c.currency_acronym,
  (
    (
      SELECT
        count(1) AS count
      FROM
        rating r
      WHERE
        ((r.book_id) :: text = (b.id) :: text)
    )
  ) :: numeric AS reviews,
  (
    SELECT
      avg(r.value) AS avg
    FROM
      rating r
    WHERE
      ((r.book_id) :: text = (b.id) :: text)
  ) AS rating,
  b.created_at
FROM
  (
    (
      (
        (
          (
            book b
            JOIN book_authors ba ON (((b.id) :: text = (ba.book_id) :: text))
          )
          JOIN author a ON (((a.id) :: text = (ba.author_id) :: text))
        )
        JOIN book_categories bc ON (((b.id) :: text = (bc.book_id) :: text))
      )
      JOIN category ctg ON (((ctg.id) :: text = (bc.category_id) :: text))
    )
    JOIN currency c ON (((c.id) :: text = (b.currency_id) :: text))
  );