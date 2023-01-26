import React from "react";
import { makeStyles, Theme, Container } from "@material-ui/core";
import ReactMarkdown from "react-markdown"
import PageContainer from "../../components/page-container";

type BlogPageProps = {};

const BlogPage = (props: BlogPageProps) => {
    const classes = useStyles();
    return <Container className={classes.root} maxWidth={false} disableGutters>
        <PageContainer className={classes.markdownContainer}>
            <ReactMarkdown ># Hello, *world*!</ReactMarkdown>
        </PageContainer>
    </Container>;
};

export default BlogPage;

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
    },
    markdownContainer: {
        marginTop: "1rem",
        textAlign: "left",
    }
}));