-- https://css-tricks.com/almanac/properties/i/image-rendering/


module Semseg exposing (..)

import Array
import Browser
import Browser.Navigation
import Dict
import File
import File.Select
import Gradio
import Html exposing (div)
import Html.Attributes exposing (class)
import Html.Events
import Http
import Json.Decode as D
import Json.Encode as E
import Parser exposing ((|.), (|=))
import Random
import Requests
import Semseg.Examples
import Set
import Svg
import Svg.Attributes
import Task
import Url
import Url.Builder
import Url.Parser exposing ((</>), (<?>))
import Url.Parser.Query


isProduction =
    True


main =
    Browser.application
        { init = init
        , view = view
        , update = update
        , subscriptions = \model -> Sub.none
        , onUrlRequest = onUrlRequest
        , onUrlChange = onUrlChange
        }



-- MESSAGE


type Msg
    = NoOp
    | SetUrl Int
    | SetExample Int
    | GetRandomExample
    | HoverPatch Int
    | ResetHoveredPatch
    | ToggleSelectedPatch Int
    | ResetSelectedPatches
    | SetSlider Int String
    | ToggleHighlights Int
      -- API responses
    | GotExample Requests.Id (Result Gradio.Error Example)
    | GotSaeLatents Requests.Id (Result Gradio.Error (List SaeLatent))
    | GotOrigPreds Requests.Id (Result Gradio.Error Example)
    | GotModPreds Requests.Id (Result Gradio.Error Example)
    | ImageUploader ImageUploaderMsg


type ImageUploaderMsg
    = Upload
    | DragEnter
    | DragLeave
    | GotFile File.File
    | GotPreview String



-- MODEL


type alias Model =
    { key : Browser.Navigation.Key
    , ade20kIndex : Maybe Int
    , example : Requests.Requested Example Gradio.Error
    , imageUploaderHover : Bool
    , hoveredPatchIndex : Maybe Int
    , selectedPatchIndices : Set.Set Int
    , saeLatents : Requests.Requested (List SaeLatent) Gradio.Error

    -- Semantic segmenations
    , origPreds : Requests.Requested Example Gradio.Error
    , modPreds : Requests.Requested Example Gradio.Error

    -- UI
    , sliders : Dict.Dict Int Float
    , toggles : Dict.Dict Int Bool

    -- API
    , gradio : Gradio.Config
    , exampleReqId : Requests.Id
    , saeLatentsReqId : Requests.Id
    , origPredsReqId : Requests.Id
    , modPredsReqId : Requests.Id
    }


type alias SaeLatent =
    { latent : Int
    , examples : List HighlightedExample
    }


type alias Example =
    { image : Gradio.Base64Image
    , labels : Gradio.Base64Image
    , classes : Set.Set Int
    }


type alias HighlightedExample =
    { image : Gradio.Base64Image
    , highlighted : Gradio.Base64Image
    , labels : Gradio.Base64Image
    , classes : Set.Set Int
    }


init : () -> Url.Url -> Browser.Navigation.Key -> ( Model, Cmd Msg )
init _ url key =
    let
        gradio =
            if isProduction then
                { host = "https://samuelstevens-saev-semantic-segmentation.hf.space" }

            else
                { host = "http://localhost:7860" }

        ( ade20kIndex, cmd ) =
            case Maybe.andThen .index (Url.Parser.parse urlParser url) of
                Just index ->
                    ( Just index
                    , getExample gradio
                        (Requests.next Requests.init)
                        index
                    )

                Nothing ->
                    ( Nothing, Random.generate SetUrl randomExample )

        model =
            { key = key
            , ade20kIndex = ade20kIndex

            -- Image to segment.
            , example = Requests.Initial
            , imageUploaderHover = False

            -- Patches
            , hoveredPatchIndex = Nothing
            , selectedPatchIndices = Set.empty

            --
            , saeLatents = Requests.Initial

            --
            , origPreds = Requests.Initial
            , modPreds = Requests.Initial

            -- UI
            , sliders = Dict.empty
            , toggles = Dict.empty

            -- API
            , gradio = gradio
            , exampleReqId = Requests.init
            , saeLatentsReqId = Requests.init
            , origPredsReqId = Requests.init
            , modPredsReqId = Requests.init
            }
    in
    ( model, cmd )



-- UPDATE


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model, Cmd.none )

        SetUrl i ->
            let
                url =
                    Url.Builder.relative [] [ Url.Builder.int "example" i ]
            in
            ( model, Browser.Navigation.pushUrl model.key url )

        SetExample i ->
            let
                index =
                    modBy nImages i

                exampleReqId =
                    Requests.next model.exampleReqId
            in
            ( { model
                | ade20kIndex = Just index
                , example = Requests.Loading
                , selectedPatchIndices = Set.empty
                , saeLatents = Requests.Initial
                , origPreds = Requests.Loading
                , modPreds = Requests.Initial
                , exampleReqId = exampleReqId
              }
            , getExample model.gradio exampleReqId index
            )

        GetRandomExample ->
            ( { model
                | example = Requests.Loading
                , selectedPatchIndices = Set.empty
                , saeLatents = Requests.Initial
                , origPreds = Requests.Loading
                , modPreds = Requests.Initial
              }
            , Random.generate SetUrl randomExample
            )

        HoverPatch i ->
            ( { model | hoveredPatchIndex = Just i }, Cmd.none )

        ResetHoveredPatch ->
            ( { model | hoveredPatchIndex = Nothing }, Cmd.none )

        ToggleSelectedPatch i ->
            let
                patchIndices =
                    if Set.member i model.selectedPatchIndices then
                        Set.remove i model.selectedPatchIndices

                    else
                        Set.insert i model.selectedPatchIndices

                saeLatentsReqId =
                    Requests.next model.saeLatentsReqId

                cmd =
                    case model.example of
                        Requests.Loaded { image } ->
                            getSaeLatents model.gradio
                                saeLatentsReqId
                                image
                                patchIndices

                        _ ->
                            Cmd.none

                saeLatents =
                    if Set.isEmpty patchIndices then
                        Requests.Initial

                    else
                        Requests.Loading
            in
            ( { model
                | selectedPatchIndices = patchIndices
                , saeLatents = saeLatents
                , modPreds = Requests.Initial
                , saeLatentsReqId = saeLatentsReqId
              }
            , cmd
            )

        ResetSelectedPatches ->
            ( { model
                | selectedPatchIndices = Set.empty
                , saeLatents = Requests.Initial
                , modPreds = Requests.Initial
              }
            , Cmd.none
            )

        SetSlider i str ->
            case String.toFloat str of
                Just f ->
                    let
                        sliders =
                            Dict.insert i f model.sliders

                        modPredsReqId =
                            Requests.next model.modPredsReqId

                        cmd =
                            case model.example of
                                Requests.Loaded { image } ->
                                    getModPreds model.gradio
                                        modPredsReqId
                                        image
                                        sliders

                                _ ->
                                    Cmd.none
                    in
                    ( { model | sliders = sliders }
                    , cmd
                    )

                Nothing ->
                    ( model, Cmd.none )

        ToggleHighlights latent ->
            let
                toggles =
                    Dict.update latent
                        -- If missing, assume it's highlighted
                        (Maybe.withDefault True
                            -- Flip the toggle
                            >> not
                            -- Needs to be a Maybe for Dict.update
                            >> Just
                        )
                        model.toggles
            in
            ( { model | toggles = toggles }, Cmd.none )

        GotExample id result ->
            if Requests.isStale id model.exampleReqId then
                ( model, Cmd.none )

            else
                case result of
                    Ok example ->
                        let
                            origPredsReqId =
                                Requests.next model.origPredsReqId
                        in
                        ( { model
                            | example = Requests.Loaded example
                            , origPredsReqId = origPredsReqId
                          }
                        , getOrigPreds model.gradio origPredsReqId example.image
                        )

                    Err err ->
                        ( { model | example = Requests.Failed err }
                        , Cmd.none
                        )

        GotSaeLatents id result ->
            if Requests.isStale id model.saeLatentsReqId then
                ( model, Cmd.none )

            else
                case result of
                    Ok latents ->
                        let
                            sliders =
                                latents
                                    |> List.map .latent
                                    |> List.map (\latent -> ( latent, 0.0 ))
                                    |> Dict.fromList

                            toggles =
                                latents
                                    |> List.map (\latent -> ( latent.latent, True ))
                                    |> Dict.fromList
                        in
                        ( { model
                            | saeLatents = Requests.Loaded latents
                            , toggles = toggles
                            , sliders = sliders
                          }
                        , Cmd.none
                        )

                    Err err ->
                        ( { model | saeLatents = Requests.Failed err }, Cmd.none )

        GotOrigPreds id result ->
            if Requests.isStale id model.origPredsReqId then
                ( model, Cmd.none )

            else
                case result of
                    Ok preds ->
                        ( { model | origPreds = Requests.Loaded preds }, Cmd.none )

                    Err err ->
                        ( { model
                            | origPreds = Requests.Failed err
                          }
                        , Cmd.none
                        )

        GotModPreds id result ->
            if Requests.isStale id model.modPredsReqId then
                ( model, Cmd.none )

            else
                case result of
                    Ok preds ->
                        ( { model | modPreds = Requests.Loaded preds }, Cmd.none )

                    Err err ->
                        ( { model
                            | modPreds = Requests.Failed err
                          }
                        , Cmd.none
                        )

        ImageUploader imageMsg ->
            imageUploaderUpdate model imageMsg


imageUploaderUpdate : Model -> ImageUploaderMsg -> ( Model, Cmd Msg )
imageUploaderUpdate model msg =
    case msg of
        Upload ->
            ( model, File.Select.file [ "image/*" ] (GotFile >> ImageUploader) )

        DragEnter ->
            ( { model | imageUploaderHover = True }, Cmd.none )

        DragLeave ->
            ( { model | imageUploaderHover = False }, Cmd.none )

        GotFile file ->
            ( { model | imageUploaderHover = False }
            , Task.perform (GotPreview >> ImageUploader) <| File.toUrl file
            )

        GotPreview preview ->
            case Gradio.base64Image preview of
                Just image ->
                    let
                        origPredsReqId =
                            Requests.next model.origPredsReqId
                    in
                    ( { model
                        | example =
                            Requests.Loaded
                                { image = image
                                , labels = Gradio.base64ImageEmpty
                                , classes = Set.empty
                                }
                        , selectedPatchIndices = Set.empty
                        , saeLatents = Requests.Initial
                        , origPreds = Requests.Loading
                        , modPreds = Requests.Initial
                        , origPredsReqId = origPredsReqId
                      }
                    , getOrigPreds model.gradio origPredsReqId image
                    )

                Nothing ->
                    ( { model | example = Requests.Failed (Gradio.UserError "Uploaded image was not base64.") }
                    , Cmd.none
                    )


onUrlRequest : Browser.UrlRequest -> Msg
onUrlRequest request =
    NoOp


onUrlChange : Url.Url -> Msg
onUrlChange url =
    Url.Parser.parse urlParser url
        |> Maybe.andThen .index
        |> Maybe.withDefault 0
        |> SetExample


type alias QueryParams =
    { index : Maybe Int
    }


urlParser : Url.Parser.Parser (QueryParams -> a) a
urlParser =
    if isProduction then
        Url.Parser.s "saev"
            </> Url.Parser.s "demos"
            </> Url.Parser.s "semseg"
            <?> Url.Parser.Query.int "example"
            |> Url.Parser.map QueryParams

    else
        Url.Parser.s "web"
            </> Url.Parser.s "apps"
            </> Url.Parser.s "semseg"
            <?> Url.Parser.Query.int "example"
            |> Url.Parser.map QueryParams



-- API


explainGradioError : Gradio.Error -> Html.Html Msg
explainGradioError err =
    let
        githubLink =
            Html.a
                [ Html.Attributes.href "https://github.com/Imageomics/saev/issues/new"
                , class "text-sky-500 hover:underline"
                ]
                [ Html.text "GitHub" ]
    in
    case err of
        Gradio.NetworkError msg ->
            Html.span
                []
                [ Html.text ("Network error: " ++ msg ++ ". Try refreshing the page. If that doesn't work, reach out on ")
                , githubLink
                , Html.text "."
                ]

        Gradio.JsonError msg ->
            Html.span
                []
                [ Html.text "Error decoding JSON. You can try refreshing the page, but it's probably a bug. Please reach out on "
                , githubLink
                , Html.text "."
                ]

        Gradio.ParsingError msg ->
            Html.span
                []
                [ Html.text ("Error parsing API response: " ++ msg ++ ". This is typically due to server load. Refresh the page, and if that doesn't work, reach out on ")
                , githubLink
                , Html.text "."
                ]

        Gradio.ApiError msg ->
            Html.span
                []
                [ Html.text ("Error in the API: " ++ msg ++ ". You can try refreshing the page, but it's probably a bug. Please reach out on ")
                , githubLink
                , Html.text "."
                ]

        Gradio.UserError msg ->
            Html.span
                []
                [ Html.text ("User Error: " ++ msg ++ ". You can refresh the page or retry whatever you were doing. Please reach out on ")
                , githubLink
                , Html.text " if you cannot resolve it."
                ]


encodeArgs : List E.Value -> E.Value
encodeArgs args =
    E.object [ ( "data", E.list identity args ) ]


getExample : Gradio.Config -> Requests.Id -> Int -> Cmd Msg
getExample cfg id img =
    Gradio.get cfg
        "get-img"
        [ E.int img ]
        (Gradio.decodeOne exampleDecoder)
        (GotExample id)


getOrigPreds : Gradio.Config -> Requests.Id -> Gradio.Base64Image -> Cmd Msg
getOrigPreds cfg id img =
    Gradio.get cfg
        "get-orig-preds"
        [ Gradio.encodeImg img ]
        (Gradio.decodeOne exampleDecoder)
        (GotOrigPreds id)


getModPreds : Gradio.Config -> Requests.Id -> Gradio.Base64Image -> Dict.Dict Int Float -> Cmd Msg
getModPreds cfg id img sliders =
    Gradio.get cfg
        "get-mod-preds"
        [ Gradio.encodeImg img
        , E.dict String.fromInt E.float sliders
        ]
        (Gradio.decodeOne exampleDecoder)
        (GotModPreds id)


getSaeLatents : Gradio.Config -> Requests.Id -> Gradio.Base64Image -> Set.Set Int -> Cmd Msg
getSaeLatents cfg id img patches =
    Gradio.get cfg
        "get-sae-latents"
        [ Gradio.encodeImg img
        , Set.toList patches |> E.list E.int
        ]
        (Gradio.decodeOne
            (D.list
                (D.map2 SaeLatent
                    (D.field "latent" D.int)
                    (D.field "examples" (D.list highlightedExampleDecoder))
                )
            )
        )
        (GotSaeLatents id)


exampleDecoder : D.Decoder Example
exampleDecoder =
    D.map3 Example
        (D.field "orig_url" Gradio.base64ImageDecoder)
        (D.field "seg_url" Gradio.base64ImageDecoder)
        (D.field "classes" (D.list D.int |> D.map Set.fromList))


highlightedExampleDecoder : D.Decoder HighlightedExample
highlightedExampleDecoder =
    D.map4 HighlightedExample
        (D.field "orig_url" Gradio.base64ImageDecoder)
        (D.field "highlighted_url" Gradio.base64ImageDecoder)
        (D.field "seg_url" Gradio.base64ImageDecoder)
        (D.field "classes" (D.list D.int |> D.map Set.fromList))


imgUrlDecoder : D.Decoder String
imgUrlDecoder =
    D.field "url" D.string
        |> D.map (String.replace "gradio_api/gradio_api" "gradio_api")
        |> D.map (String.replace "gra/gradio_api" "gradio_api")
        |> D.map (String.replace "gradio_ap/gradio_api" "gradio_api")
        |> D.map (String.replace "gradio_api/ca/gradio_api" "gradio_api")
        |> D.map (String.replace "gradio_api/call/gradio_api" "gradio_api")



-- VIEW


view : Model -> Browser.Document Msg
view model =
    { title = "Semantic Segmentation"
    , body =
        [ Html.main_
            [ class "w-full min-h-screen space-y-4 bg-gray-50 p-1 xs:p-2 lg:p-4" ]
            [ Html.h1
                [ class "font-bold text-2xl" ]
                [ Html.text "SAEs for Scientifically Rigorous Interpretation of Vision Models" ]
            , viewInstructions model.example
            , viewControls model.ade20kIndex
            , div
                [ class "flex flex-col gap-1 lg:flex-row xl:flex-col" ]
                [ div
                    [ class "grid gap-1 md:grid-cols-[336px_336px] xl:grid-cols-[336px_336px_336px_336px]" ]
                    [ viewGriddedImage model
                        (Requests.map .image model.example)
                        "Input Image"
                        "Wait just a second..."
                    , viewGriddedImage model
                        (Requests.map .labels model.example)
                        "True Labels"
                        "Wait just a second..."
                    , viewGriddedImage model
                        (Requests.map .labels model.origPreds)
                        "Predicted Segmentation"
                        "Wait just a second..."
                    , viewGriddedImage model
                        (Requests.map .labels model.modPreds)
                        "Modified Segmentation"
                        (if Set.isEmpty model.selectedPatchIndices then
                            "Click on the image to explain model predictions."

                         else
                            "Modify the ViT's representations using the sliders."
                        )
                    ]
                , Set.empty
                    |> Set.union (getClasses model.example)
                    |> Set.union (getClasses model.origPreds)
                    |> Set.union (getClasses model.modPreds)
                    |> viewLegend
                ]
            , viewSaeLatents
                model.saeLatents
                model.toggles
                model.sliders
            ]
        ]
    }


viewErr : Gradio.Error -> Html.Html Msg
viewErr err =
    div
        [ class "relative rounded-lg border border-red-200 bg-red-50 p-4 m-4" ]
        [ Html.h3
            [ class "font-bold text-red-800" ]
            [ Html.text "Error" ]
        , Html.p
            [ class "text-red-700" ]
            [ explainGradioError err ]
        ]


viewInstructions : Requests.Requested Example Gradio.Error -> Html.Html Msg
viewInstructions current =
    let
        guided =
            case current of
                Requests.Loaded example ->
                    guidedExamples
                        |> List.filter (\g -> example.image == g.image)
                        |> List.head
                        |> Maybe.withDefault missingGuidedExample

                _ ->
                    missingGuidedExample
    in
    Html.details
        [ Html.Attributes.attribute "open" ""
        ]
        [ Html.summary
            []
            [ Html.span
                [ class "cursor-pointer font-bold text-l"
                ]
                [ Html.text "Instructions" ]
            , Html.span
                [ class "cursor-pointer italic"
                ]
                [ Html.text " (click to toggle)" ]
            ]

        -- Raw
        , Html.div
            [ class "md:flex md:gap-6" ]
            [ Html.ol
                [ class "list-decimal pl-4 space-y-1 md:flex-1" ]
                [ Html.li []
                    [ Html.text "Click any example to see a DINOv2-powered segmentation."
                    ]
                , Html.li []
                    [ Html.text "Can you selectively modify how the model interprets just one semantic element?"
                    ]
                , Html.li []
                    [ Html.text "Click on all the patches for a given concept and observe which SAE feature are most activated by these patches. "
                    , guided.concept
                    ]
                , Html.li []
                    [ Html.text ("Test for feature independence: suppress this feature across ALL patches in the entire image by changing the slider to " ++ String.fromInt guided.recommendedValue ++ ".")
                    ]
                , Html.li []
                    [ Html.text ("If SAE features were not pseudo-orthogonal, this global modification would cause widespread disruption." ++ guided.change)
                    ]
                ]
            , Html.div
                [ class "grid grid-cols-2 sm:grid-cols-4 md:inline-grid md:grid-cols-2 md:items-start xl:grid-cols-4"
                , class "gap-1 mt-4 md:mt-0"
                ]
                (List.map
                    viewGuidedExampleButton
                    guidedExamples
                )
            ]
        ]


viewGuidedExampleButton : GuidedExample -> Html.Html Msg
viewGuidedExampleButton example =
    Html.div
        [ class "w-full md:w-36 flex flex-col space-y-1" ]
        [ Html.img
            [ Html.Attributes.src (Gradio.base64ImageToString example.image)
            , Html.Events.onClick (SetUrl example.index)
            , class "cursor-pointer"
            ]
            []
        , Html.button
            [ Html.Events.onClick (SetUrl example.index)
            , class "flex-1 rounded-lg px-2 py-1 transition-colors"
            , class "border border-sky-300 hover:border-sky-400"
            , class "bg-sky-100 hover:bg-sky-200"
            , class "text-gray-700 hover:text-gray-900"
            , class "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            , class "active:bg-gray-300"
            ]
            [ Html.text ("Example #" ++ String.fromInt example.index) ]
        ]


viewControls : Maybe Int -> Html.Html Msg
viewControls ade20kIndex =
    let
        ( prevButton, nextButton ) =
            case ade20kIndex of
                Just i ->
                    ( viewButton (SetUrl (i - 1)) "Previous" True
                    , viewButton (SetUrl (i + 1)) "Next" True
                    )

                Nothing ->
                    ( viewButton NoOp "Previous" False
                    , viewButton NoOp "Next" False
                    )
    in
    div
        [ class "flex flex-row gap-2" ]
        [ prevButton
        , viewButton GetRandomExample "Random" True
        , nextButton
        , viewButton (ImageUploader Upload) "Upload" True

        -- , viewButton (ResetPatches) "Reset Patches" True
        ]


viewButton : Msg -> String -> Bool -> Html.Html Msg
viewButton onClick title enabled =
    Html.button
        [ Html.Events.onClick onClick
        , Html.Attributes.disabled (not enabled)
        , class "flex-1 rounded-lg px-2 py-1 transition-colors"
        , class "border border-sky-300 hover:border-sky-400"
        , class "bg-sky-100 hover:bg-sky-200"
        , class "text-gray-700 hover:text-gray-900"
        , class "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        , class "active:bg-gray-300"
        , class "disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400"
        , class "disabled:cursor-not-allowed"
        , class "disabled:hover:bg-gray-100 disabled:hover:border-gray-200 disabled:hover:text-gray-400"
        ]
        [ Html.text title ]


viewGriddedImage : Model -> Requests.Requested Gradio.Base64Image Gradio.Error -> String -> String -> Html.Html Msg
viewGriddedImage model reqImage title callToAction =
    case reqImage of
        Requests.Initial ->
            div
                [ class "text-center" ]
                [ Html.p
                    [ class "text-center" ]
                    [ Html.text title ]
                , Html.p
                    [ class "italic" ]
                    [ Html.text callToAction ]
                ]

        Requests.Loading ->
            div
                [ class "text-center" ]
                [ Html.p
                    [ class "text-center" ]
                    [ Html.text title ]
                , viewSpinner "Loading"
                ]

        Requests.Failed err ->
            viewErr err

        Requests.Loaded image ->
            div
                [ class "text-center" ]
                [ Html.p
                    [ class "flex flex-row justify-center items-center gap-1" ]
                    [ Html.span
                        [ class "" ]
                        [ Html.text title ]
                    , Html.a
                        [ Html.Attributes.href (Gradio.base64ImageToString image)
                        , Html.Attributes.target "_blank"
                        , Html.Attributes.rel "noopener noreferrer"
                        , class "text-blue-600 underline text-sm italic"
                        ]
                        [ Html.text "Open Image" ]
                    ]
                , div
                    [ class "relative inline-block" ]
                    [ div
                        [ class "absolute grid"
                        , class "grid-rows-[repeat(16,_14px)] grid-cols-[repeat(16,_14px)]"
                        , class "xs:grid-rows-[repeat(16,_21px)] xs:grid-cols-[repeat(16,_21px)]"
                        ]
                        (List.map
                            (viewGridCell model.hoveredPatchIndex model.selectedPatchIndices)
                            (List.range 0 255)
                        )
                    , Html.img
                        [ class "block"
                        , class "w-[224px] h-[224px]"
                        , class "xs:w-[336px] xs:h-[336px]"
                        , Html.Attributes.src (Gradio.base64ImageToString image)
                        , Html.Attributes.style "image-rendering" "pixelated"
                        ]
                        []
                    ]
                ]


viewGridCell : Maybe Int -> Set.Set Int -> Int -> Html.Html Msg
viewGridCell hovered selected self =
    let
        classes =
            (case hovered of
                Just h ->
                    if h == self then
                        [ "border-2 border-rose-600 border-dashed" ]

                    else
                        []

                Nothing ->
                    []
            )
                ++ (if Set.member self selected then
                        [ "bg-rose-600/50" ]

                    else
                        []
                   )
    in
    div
        ([ class "w-[14px] h-[14px] sm:w-[21px] sm:h-[21px]"
         , Html.Events.onMouseEnter (HoverPatch self)
         , Html.Events.onMouseLeave ResetHoveredPatch
         , Html.Events.onClick (ToggleSelectedPatch self)
         ]
            ++ List.map class classes
        )
        []


viewLegend : Set.Set Int -> Html.Html Msg
viewLegend classes =
    div
        [ Html.Attributes.id "legend" ]
        [ Html.p
            [ class "font-bold text-l" ]
            [ Html.text "Legend" ]
        , div
            [ class "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-4" ]
            (Set.toList classes
                |> List.sort
                |> List.filter (\x -> x > 0)
                |> List.map viewClassIcon
            )
        ]


viewClassIcon : Int -> Html.Html Msg
viewClassIcon cls =
    let
        color =
            case Array.get (cls - 1) colors of
                Just ( r, g, b ) ->
                    "rgb(" ++ String.fromInt r ++ " " ++ String.fromInt g ++ " " ++ String.fromInt b ++ ")"

                Nothing ->
                    "red"

        classname =
            case Array.get (cls - 1) classnames of
                Just names ->
                    names |> List.take 2 |> String.join ", "

                Nothing ->
                    "no classname found"
    in
    div
        [ class "flex flex-row gap-1 items-center" ]
        [ Html.span
            [ class "w-4 h-4"
            , Html.Attributes.style "background-color" color
            ]
            []
        , Html.span
            []
            [ Html.text (classname ++ " (class " ++ String.fromInt cls ++ ")") ]
        ]


viewSaeLatents : Requests.Requested (List SaeLatent) Gradio.Error -> Dict.Dict Int Bool -> Dict.Dict Int Float -> Html.Html Msg
viewSaeLatents requestedLatents toggles values =
    case requestedLatents of
        Requests.Initial ->
            Html.p [ class "italic" ]
                [ Html.text "Click on the image above to find similar image patches using a "
                , Html.a
                    []
                    [ Html.text "sparse autoencoder (SAE)" ]
                , Html.text "."
                ]

        Requests.Loading ->
            viewSpinner "Loading similar patches"

        Requests.Failed err ->
            viewErr err

        Requests.Loaded latents ->
            div
                [ class "grid grid-cols-1 gap-2 lg:grid-cols-2" ]
                (List.filterMap
                    (\latent ->
                        Maybe.map2
                            (viewSaeLatent latent)
                            (Dict.get latent.latent toggles)
                            (Dict.get latent.latent values)
                    )
                    latents
                )


viewSaeLatent : SaeLatent -> Bool -> Float -> Html.Html Msg
viewSaeLatent latent highlighted value =
    div
        []
        [ div
            [ class "grid grid-cols-4" ]
            (List.map
                (\ex ->
                    if highlighted then
                        viewExample ex.highlighted

                    else
                        viewExample ex.image
                )
                latent.examples
            )
        , Html.div
            [ class "sm:flex sm:items-center sm:justify-between sm:space-x-3 sm:mt-1" ]
            [ -- Slider + latent label
              Html.div
                [ class "inline-flex items-center" ]
                [ Html.input
                    [ Html.Attributes.type_ "range"
                    , Html.Attributes.min "-10"
                    , Html.Attributes.max "10"
                    , Html.Attributes.value (String.fromFloat value)
                    , Html.Events.onInput (SetSlider latent.latent)
                    , class "md:max-w-24 lg:max-w-36"
                    ]
                    []
                , Html.label
                    [ class "ms-3 text-sm font-medium text-gray-900 dark:text-gray-300" ]
                    [ Html.span [ class "font-mono" ] [ Html.text ("DINOv2-24K/" ++ String.fromInt latent.latent) ]
                    , Html.text (": " ++ viewSliderValue value)
                    ]
                ]
            , viewToggle "Highlights" highlighted (ToggleHighlights latent.latent)
            ]
        ]


viewSliderValue : Float -> String
viewSliderValue value =
    if value > 0 then
        "+" ++ String.fromFloat value

    else
        String.fromFloat value


viewExample : Gradio.Base64Image -> Html.Html Msg
viewExample img =
    Html.img
        [ Html.Attributes.src (Gradio.base64ImageToString img)
        , class "w-full h-auto"
        ]
        []


viewToggle : String -> Bool -> Msg -> Html.Html Msg
viewToggle text active onToggle =
    -- https://flowbite.com/docs/forms/toggle/
    Html.label
        [ class "inline-flex items-center cursor-pointer" ]
        [ Html.input
            [ Html.Attributes.type_ "checkbox"
            , Html.Attributes.checked active
            , Html.Events.onClick onToggle
            , class "sr-only peer"
            ]
            []
        , Html.div
            [ class "relative w-11 h-6 bg-gray-200 rounded-full peer "
            , class "peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
            , class "rtl:peer-checked:after:-translate-x-full"
            , class "after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
            , class "dark:peer-focus:ring-blue-800 dark:bg-gray-700 dark:border-gray-600 dark:peer-checked:bg-blue-600"
            , class "peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600"
            ]
            []
        , Html.span
            [ class "ms-3 text-sm font-medium text-gray-900 dark:text-gray-300" ]
            [ Html.text text ]
        ]



-- HELPERS


bold : String -> Html.Html Msg
bold text =
    Html.span [ class "font-bold" ] [ Html.text text ]


getClasses : Requests.Requested Example Gradio.Error -> Set.Set Int
getClasses example =
    case example of
        Requests.Loading ->
            Set.empty

        Requests.Initial ->
            Set.empty

        Requests.Failed _ ->
            Set.empty

        Requests.Loaded { classes } ->
            classes


viewSpinner : String -> Html.Html Msg
viewSpinner text =
    Html.div
        [ class "flex flex-row items-center gap-2" ]
        [ Svg.svg
            [ Svg.Attributes.class "w-8 h-8 text-gray-200 fill-blue-600 animate-spin"
            , Svg.Attributes.viewBox "0 0 100 101"
            , Svg.Attributes.fill "none"
            ]
            [ Svg.path
                [ Svg.Attributes.d "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                , Svg.Attributes.fill "currentColor"
                ]
                []
            , Svg.path
                [ Svg.Attributes.d "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                , Svg.Attributes.fill "currentFill"
                ]
                []
            ]
        , Html.span [ class "italic text-gray-600" ] [ Html.text text ]
        ]


type alias GuidedExample =
    { index : Int
    , image : Gradio.Base64Image
    , concept : Html.Html Msg
    , recommendedValue : Int
    , change : String
    }


guidedExamples : List GuidedExample
guidedExamples =
    [ { index = 1872
      , image = Semseg.Examples.image1872
      , concept =
            Html.span
                []
                [ Html.text "For example, try selecting a couple patches over the car in the bottom left corner. You might see the "
                , Html.span [ class "font-mono" ] [ Html.text "DINOv2-24K/7235" ]
                , Html.text " SAE feature."
                ]
      , recommendedValue = -6
      , change = "Instead, only the 'car, auto' (class 21) class is removed. Other predictions, like the buildings, are unchanged."
      }
    , { index = 1633
      , image = Semseg.Examples.image1633
      , concept =
            Html.span
                []
                [ Html.text "For example, try selecting the patches for the painting in the middle of the wall. You might see the "
                , Html.span [ class "font-mono" ] [ Html.text "DINOv2-24K/16446" ]
                , Html.text " SAE feature."
                ]
      , recommendedValue = -5
      , change = "Instead, only the 'painting, picture' (class 23) class is removed. Other predictions, like the floor, are unchanged."
      }
    , { index = 1099
      , image = Semseg.Examples.image1099
      , concept =
            Html.span
                []
                [ Html.text "For example, try selecting the patches for the toilet. You might see the "
                , Html.span [ class "font-mono" ] [ Html.text "DINOv2-24K/5876" ]
                , Html.text " or "
                , Html.span [ class "font-mono" ] [ Html.text "DINOv2-24K/10875" ]
                , Html.text " SAE features."
                ]
      , recommendedValue = -2
      , change = "Instead, only the 'toilet, can' (class 66) class is removed. Other predictions, like the floor, are unchanged."
      }
    , { index = 1117
      , image = Semseg.Examples.image1117
      , concept =
            Html.span
                []
                [ Html.text "For example, try selecting the patches for the bed cover in the middle of the image. You might see the "
                , Html.span [ class "font-mono" ] [ Html.text "DINOv2-24K/18834" ]
                , Html.text " SAE feature."
                ]
      , recommendedValue = -2
      , change = "Instead, only the 'bed' (class 8) class is removed. Other predictions, like the painting, are unchanged."
      }
    ]


missingGuidedExample : GuidedExample
missingGuidedExample =
    { index = -1
    , image = Gradio.base64ImageEmpty
    , concept = Html.text ""
    , change = ""
    , recommendedValue = -8
    }



-- CONSTANTS


nImages =
    2000


nSaeLatents =
    3


nSaeExamplesPerLatent =
    4


randomExample : Random.Generator Int
randomExample =
    Random.int 0 (nImages - 1)


colors : Array.Array ( Int, Int, Int )
colors =
    [ ( 51, 0, 0 ), ( 204, 0, 102 ), ( 0, 255, 0 ), ( 102, 51, 51 ), ( 153, 204, 51 ), ( 51, 51, 153 ), ( 102, 0, 51 ), ( 153, 153, 0 ), ( 51, 102, 204 ), ( 204, 255, 0 ), ( 204, 102, 0 ), ( 204, 255, 153 ), ( 102, 102, 255 ), ( 255, 204, 255 ), ( 51, 255, 0 ), ( 0, 102, 51 ), ( 102, 102, 0 ), ( 0, 0, 255 ), ( 255, 153, 204 ), ( 204, 204, 0 ), ( 0, 153, 153 ), ( 153, 102, 204 ), ( 255, 204, 0 ), ( 204, 204, 153 ), ( 255, 51, 0 ), ( 51, 51, 0 ), ( 153, 51, 51 ), ( 0, 0, 102 ), ( 102, 255, 204 ), ( 204, 51, 255 ), ( 255, 204, 204 ), ( 0, 0, 153 ), ( 0, 102, 153 ), ( 153, 0, 51 ), ( 51, 51, 102 ), ( 255, 153, 0 ), ( 204, 153, 0 ), ( 153, 102, 153 ), ( 51, 204, 204 ), ( 51, 51, 255 ), ( 153, 204, 102 ), ( 102, 204, 153 ), ( 153, 153, 204 ), ( 0, 51, 204 ), ( 204, 204, 102 ), ( 0, 51, 153 ), ( 0, 102, 0 ), ( 51, 0, 102 ), ( 153, 255, 0 ), ( 153, 255, 102 ), ( 102, 102, 51 ), ( 153, 0, 255 ), ( 204, 255, 102 ), ( 102, 0, 255 ), ( 255, 204, 153 ), ( 102, 51, 0 ), ( 102, 204, 102 ), ( 0, 102, 204 ), ( 51, 204, 0 ), ( 255, 102, 102 ), ( 153, 255, 204 ), ( 51, 204, 51 ), ( 0, 0, 0 ), ( 255, 0, 255 ), ( 153, 0, 153 ), ( 255, 204, 51 ), ( 51, 0, 51 ), ( 102, 204, 255 ), ( 153, 204, 153 ), ( 153, 102, 0 ), ( 102, 204, 204 ), ( 204, 204, 204 ), ( 255, 0, 0 ), ( 255, 255, 51 ), ( 0, 255, 102 ), ( 204, 153, 102 ), ( 204, 153, 153 ), ( 102, 51, 153 ), ( 51, 102, 0 ), ( 204, 51, 153 ), ( 153, 51, 255 ), ( 102, 0, 204 ), ( 204, 102, 153 ), ( 204, 0, 204 ), ( 102, 51, 102 ), ( 0, 153, 51 ), ( 153, 153, 51 ), ( 255, 102, 0 ), ( 255, 153, 153 ), ( 153, 0, 102 ), ( 51, 204, 255 ), ( 102, 255, 102 ), ( 255, 255, 204 ), ( 51, 51, 204 ), ( 153, 102, 51 ), ( 153, 153, 255 ), ( 51, 153, 0 ), ( 204, 0, 255 ), ( 102, 255, 0 ), ( 153, 102, 255 ), ( 204, 102, 255 ), ( 204, 0, 0 ), ( 102, 153, 255 ), ( 204, 102, 204 ), ( 204, 51, 102 ), ( 0, 255, 153 ), ( 153, 204, 204 ), ( 255, 0, 102 ), ( 102, 51, 204 ), ( 255, 51, 204 ), ( 51, 204, 153 ), ( 153, 153, 102 ), ( 153, 204, 0 ), ( 153, 102, 102 ), ( 204, 153, 255 ), ( 153, 0, 204 ), ( 102, 0, 0 ), ( 255, 51, 255 ), ( 0, 204, 153 ), ( 255, 153, 51 ), ( 0, 255, 204 ), ( 51, 102, 153 ), ( 255, 51, 51 ), ( 102, 255, 51 ), ( 0, 0, 204 ), ( 102, 255, 153 ), ( 0, 204, 255 ), ( 0, 102, 102 ), ( 102, 51, 255 ), ( 255, 0, 204 ), ( 51, 255, 153 ), ( 204, 0, 51 ), ( 153, 51, 204 ), ( 204, 102, 51 ), ( 255, 255, 0 ), ( 51, 51, 51 ), ( 0, 153, 0 ), ( 51, 255, 102 ), ( 51, 102, 255 ), ( 102, 153, 0 ), ( 102, 153, 204 ), ( 51, 0, 255 ), ( 102, 153, 153 ), ( 153, 51, 102 ), ( 204, 255, 51 ), ( 204, 204, 51 ), ( 0, 204, 51 ), ( 255, 102, 153 ), ( 204, 102, 102 ), ( 102, 0, 102 ), ( 51, 153, 204 ), ( 255, 255, 255 ), ( 0, 102, 255 ), ( 51, 102, 51 ), ( 204, 0, 153 ), ( 102, 153, 102 ), ( 102, 0, 153 ), ( 153, 255, 153 ), ( 0, 153, 102 ), ( 102, 204, 0 ), ( 0, 255, 51 ), ( 153, 204, 255 ), ( 153, 51, 153 ), ( 0, 51, 255 ), ( 51, 255, 51 ), ( 255, 102, 51 ), ( 102, 102, 204 ), ( 102, 153, 51 ), ( 0, 204, 0 ), ( 102, 204, 51 ), ( 255, 102, 255 ), ( 255, 204, 102 ), ( 102, 102, 102 ), ( 255, 102, 204 ), ( 51, 0, 153 ), ( 255, 0, 51 ), ( 102, 102, 153 ), ( 255, 153, 102 ), ( 204, 255, 204 ), ( 51, 0, 204 ), ( 0, 0, 51 ), ( 51, 255, 255 ), ( 204, 51, 0 ), ( 153, 51, 0 ), ( 51, 153, 102 ), ( 102, 255, 255 ), ( 255, 153, 255 ), ( 204, 255, 255 ), ( 204, 153, 204 ), ( 255, 0, 153 ), ( 51, 102, 102 ), ( 153, 255, 255 ), ( 255, 255, 153 ), ( 204, 51, 204 ), ( 153, 153, 153 ), ( 51, 153, 255 ), ( 51, 153, 51 ), ( 0, 153, 255 ), ( 0, 51, 51 ), ( 0, 51, 102 ), ( 153, 0, 0 ), ( 204, 51, 51 ), ( 0, 153, 204 ), ( 153, 255, 51 ), ( 255, 255, 102 ), ( 204, 204, 255 ), ( 0, 204, 102 ), ( 255, 51, 102 ), ( 0, 255, 255 ), ( 51, 153, 153 ), ( 51, 204, 102 ), ( 51, 255, 204 ), ( 255, 51, 153 ), ( 0, 51, 0 ), ( 0, 204, 204 ), ( 204, 153, 51 ) ]
        |> Array.fromList
        -- Sky
        |> Array.set 2 ( 201, 249, 255 )
        -- Tree
        |> Array.set 4 ( 151, 204, 4 )
        -- Mountain
        |> Array.set 16 ( 54, 48, 32 )
        -- Water
        |> Array.set 21 ( 120, 202, 210 )
        -- Sea
        |> Array.set 26 ( 45, 125, 210 )
        -- Field
        |> Array.set 29 ( 116, 142, 84 )
        -- Sand
        |> Array.set 46 ( 238, 185, 2 )
        -- River
        |> Array.set 60 ( 72, 99, 156 )
        -- Palm, Palm Tree
        |> Array.set 72 ( 76, 46, 5 )
        -- Land, Ground
        |> Array.set 94 ( 12, 15, 10 )


classnames : Array.Array (List String)
classnames =
    Array.fromList
        [ [ "wall" ]
        , [ "building", "edifice" ]
        , [ "sky" ]
        , [ "floor", "flooring" ]
        , [ "tree" ]
        , [ "ceiling" ]
        , [ "road", "route" ]
        , [ "bed" ]
        , [ "windowpane", "window" ]
        , [ "grass" ]
        , [ "cabinet" ]
        , [ "sidewalk", "pavement" ]
        , [ "person", "individual" ]
        , [ "earth", "ground" ]
        , [ "door", "double door" ]
        , [ "table" ]
        , [ "mountain" ]
        , [ "plant", "flora" ]
        , [ "curtain", "drape" ]
        , [ "chair" ]
        , [ "car", "auto" ]
        , [ "water" ]
        , [ "painting", "picture" ]
        , [ "sofa", "couch" ]
        , [ "shelf" ]
        , [ "house" ]
        , [ "sea" ]
        , [ "mirror" ]
        , [ "rug", "carpet" ]
        , [ "field" ]
        , [ "armchair" ]
        , [ "seat" ]
        , [ "fence", "fencing" ]
        , [ "desk" ]
        , [ "rock", "stone" ]
        , [ "wardrobe", "closet" ]
        , [ "lamp" ]
        , [ "bathtub", "bathing tub" ]
        , [ "railing", "rail" ]
        , [ "cushion" ]
        , [ "base", "pedestal" ]
        , [ "box" ]
        , [ "column", "pillar" ]
        , [ "signboard", "sign" ]
        , [ "chest of drawers", "chest" ]
        , [ "counter" ]
        , [ "sand" ]
        , [ "sink" ]
        , [ "skyscraper" ]
        , [ "fireplace", "hearth" ]
        , [ "refrigerator", "icebox" ]
        , [ "grandstand", "covered stand" ]
        , [ "path" ]
        , [ "stairs", "steps" ]
        , [ "runway" ]
        , [ "case", "display case" ]
        , [ "pool table", "billiard table" ]
        , [ "pillow" ]
        , [ "screen door", "screen" ]
        , [ "stairway", "staircase" ]
        , [ "river" ]
        , [ "bridge", "span" ]
        , [ "bookcase" ]
        , [ "blind", "screen" ]
        , [ "coffee table", "cocktail table" ]
        , [ "toilet", "can" ]
        , [ "flower" ]
        , [ "book" ]
        , [ "hill" ]
        , [ "bench" ]
        , [ "countertop" ]
        , [ "stove", "kitchen stove" ]
        , [ "palm", "palm tree" ]
        , [ "kitchen island" ]
        , [ "computer", "computing machine" ]
        , [ "swivel chair" ]
        , [ "boat" ]
        , [ "bar" ]
        , [ "arcade machine" ]
        , [ "hovel", "hut" ]
        , [ "bus", "autobus" ]
        , [ "towel" ]
        , [ "light", "light source" ]
        , [ "truck", "motortruck" ]
        , [ "tower" ]
        , [ "chandelier", "pendant" ]
        , [ "awning", "sunshade" ]
        , [ "streetlight", "street lamp" ]
        , [ "booth", "cubicle" ]
        , [ "television receiver", "television" ]
        , [ "airplane", "aeroplane" ]
        , [ "dirt track" ]
        , [ "apparel", "wearing apparel" ]
        , [ "pole" ]
        , [ "land", "ground" ]
        , [ "bannister", "banister" ]
        , [ "escalator", "moving staircase" ]
        , [ "ottoman", "pouf" ]
        , [ "bottle" ]
        , [ "buffet", "counter" ]
        , [ "poster", "posting" ]
        , [ "stage" ]
        , [ "van" ]
        , [ "ship" ]
        , [ "fountain" ]
        , [ "conveyer belt", "conveyor belt" ]
        , [ "canopy" ]
        , [ "washer", "automatic washer" ]
        , [ "plaything", "toy" ]
        , [ "swimming pool", "swimming bath" ]
        , [ "stool" ]
        , [ "barrel", "cask" ]
        , [ "basket", "handbasket" ]
        , [ "waterfall", "falls" ]
        , [ "tent", "collapsible shelter" ]
        , [ "bag" ]
        , [ "minibike", "motorbike" ]
        , [ "cradle" ]
        , [ "oven" ]
        , [ "ball" ]
        , [ "food", "solid food" ]
        , [ "step", "stair" ]
        , [ "tank", "storage tank" ]
        , [ "trade name", "brand name" ]
        , [ "microwave", "microwave oven" ]
        , [ "pot", "flowerpot" ]
        , [ "animal", "animate being" ]
        , [ "bicycle", "bike" ]
        , [ "lake" ]
        , [ "dishwasher", "dish washer" ]
        , [ "screen", "silver screen" ]
        , [ "blanket", "cover" ]
        , [ "sculpture" ]
        , [ "hood", "exhaust hood" ]
        , [ "sconce" ]
        , [ "vase" ]
        , [ "traffic light", "traffic signal" ]
        , [ "tray" ]
        , [ "ashcan", "trash can" ]
        , [ "fan" ]
        , [ "pier", "wharf" ]
        , [ "crt screen" ]
        , [ "plate" ]
        , [ "monitor", "monitoring device" ]
        , [ "bulletin board", "notice board" ]
        , [ "shower" ]
        , [ "radiator" ]
        , [ "glass", "drinking glass" ]
        , [ "clock" ]
        , [ "flag" ]
        ]
