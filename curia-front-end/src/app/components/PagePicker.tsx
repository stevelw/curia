import { StyleSheet } from "react-native";

interface Props {
  currentPage: number;
  setPageCbFn: (page: number) => void;
  numOfPages: number;
}

export default function PagePicker({
  currentPage,
  setPageCbFn,
  numOfPages,
}: Props) {
  return (
    <div style={styles.picker}>
      <button
        onClick={() => setPageCbFn(currentPage - 1)}
        disabled={currentPage < 2}
      >
        Previous
      </button>
      {[...Array(numOfPages).keys()].map((index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            style={pageNumber === currentPage ? styles.current_page : {}}
            onClick={() => setPageCbFn(pageNumber)}
            disabled={pageNumber === currentPage}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        onClick={() => setPageCbFn(currentPage + 1)}
        disabled={currentPage >= numOfPages}
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
