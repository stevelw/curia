import { StyleSheet } from "react-native";

interface Props {
  page: number;
  setPageCbFn: (page: number) => void;
  numOfPages: number;
}

export default function PagePicker({ page, setPageCbFn, numOfPages }: Props) {
  return (
    <div style={styles.picker}>
      <button onClick={() => setPageCbFn(page - 1)} disabled={page < 2}>
        Previous
      </button>
      {[...Array(numOfPages).keys()].map((num) => {
        const pageNumber = num + 1;
        return (
          <button
            key={pageNumber}
            style={pageNumber === page ? styles.current_page : {}}
            onClick={() => setPageCbFn(pageNumber)}
            disabled={pageNumber === page}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        onClick={() => setPageCbFn(page + 1)}
        disabled={page >= numOfPages}
      >
        Next
      </button>
    </div>
  );
}

const styles = StyleSheet.create({
  picker: {
    display: "flex",
    width: "100%",
    justifyContent: "space-evenly",
  },
  current_page: {
    fontWeight: "bold",
  },
});
