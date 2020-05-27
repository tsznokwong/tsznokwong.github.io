import React from "react";

type HomePageProps = {};

const HomePage = (props: HomePageProps) => {
  return (
    <div>
      HomePage{" "}
      {[...new Array(50)]
        .map(
          () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
        )
        .join("\n")}
    </div>
  );
};

export default HomePage;
